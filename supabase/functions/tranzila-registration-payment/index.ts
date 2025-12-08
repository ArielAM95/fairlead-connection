import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

/**
 * Encrypt Tranzila token using AES-256-GCM
 * Same encryption as used in pro-ofair-app for consistency
 */
async function encryptToken(token: string): Promise<string> {
  const ENCRYPTION_KEY = Deno.env.get('ENCRYPTION_KEY');
  if (!ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY not configured');
  }

  // Convert hex string to Uint8Array
  const keyData = new Uint8Array(ENCRYPTION_KEY.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));

  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );

  const iv = crypto.getRandomValues(new Uint8Array(16));
  const encoder = new TextEncoder();
  const data = encoder.encode(token);

  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv, tagLength: 128 },
    key,
    data
  );

  const ciphertext = new Uint8Array(encrypted);
  const authTag = ciphertext.slice(-16);
  const ciphertextOnly = ciphertext.slice(0, -16);

  // Format: IV:AuthTag:Ciphertext (all base64)
  return `${btoa(String.fromCharCode(...iv))}:${btoa(String.fromCharCode(...authTag))}:${btoa(String.fromCharCode(...ciphertextOnly))}`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body = await req.json();
    console.log('Registration payment request received');
    console.log('Request body:', JSON.stringify(body, null, 2));

    const {
      phone_number,
      tranzila_token,
      card_last4,
      expiry_month,
      expiry_year,
      confirmation_code,
      amount,
      save_card = true,
      affiliate_code // NEW: Optional affiliate code
    } = body;

    console.log('Extracted values:', {
      phone_number,
      tranzila_token_length: tranzila_token?.length,
      card_last4,
      card_last4_type: typeof card_last4,
      expiry_month,
      expiry_year,
      confirmation_code,
      amount,
      affiliate_code: affiliate_code || 'none'
    });

    // Validate required fields
    if (!phone_number) {
      console.error('VALIDATION FAILED: phone_number is required');
      return new Response(
        JSON.stringify({ error: 'phone_number is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!tranzila_token || tranzila_token.length < 10) {
      console.error('VALIDATION FAILED: Invalid token:', tranzila_token);
      return new Response(
        JSON.stringify({ error: 'Invalid tranzila_token - must be at least 10 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!card_last4 || !/^\d{4}$/.test(String(card_last4))) {
      console.error('VALIDATION FAILED: Invalid card_last4:', card_last4, 'Type:', typeof card_last4);
      return new Response(
        JSON.stringify({ error: `Invalid card_last4 - must be 4 digits, received: "${card_last4}"` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const currentYear = new Date().getFullYear();
    if (!expiry_month || expiry_month < 1 || expiry_month > 12) {
      console.error('VALIDATION FAILED: Invalid expiry_month:', expiry_month);
      return new Response(
        JSON.stringify({ error: 'Invalid expiry_month - must be between 1-12' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!expiry_year || expiry_year < currentYear) {
      console.error('VALIDATION FAILED: Invalid expiry_year:', expiry_year, 'Current year:', currentYear);
      return new Response(
        JSON.stringify({ error: 'Invalid expiry_year - card expired' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('All validations passed, proceeding to find professional');

    console.log('Finding professional by phone:', phone_number);

    // Find professional by phone_number
    const { data: professional, error: profError } = await supabase
      .from('professionals')
      .select('id, phone_number, name, email')
      .eq('phone_number', phone_number)
      .single();

    if (profError || !professional) {
      console.error('Professional not found:', phone_number, profError);
      return new Response(
        JSON.stringify({
          error: 'משתמש לא נמצא - ייתכן שההרשמה נכשלה',
          details: 'Professional not found by phone number'
        }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Found professional:', professional.id, professional.name);
    console.log('save_card parameter:', save_card);

    // ============================================================
    // AFFILIATE CODE HANDLING
    // ============================================================
    let referrerId: string | null = null;
    let affiliateDiscount = 0;
    let referrerBonus = 0;
    const REGISTRATION_FEE = 413;
    const DISCOUNT_PERCENT = 10;

    if (affiliate_code) {
      console.log('Processing affiliate code:', affiliate_code);
      
      // Find the referrer by affiliate code
      const { data: referrer, error: referrerError } = await supabase
        .from('professionals')
        .select('id, name, affiliate_code')
        .eq('affiliate_code', affiliate_code.toUpperCase().trim())
        .eq('registration_payment_status', 'completed')
        .maybeSingle();

      if (referrerError) {
        console.error('Error looking up affiliate code:', referrerError);
      } else if (referrer) {
        console.log('Valid affiliate code, referrer:', referrer.name);
        referrerId = referrer.id;
        affiliateDiscount = REGISTRATION_FEE * (DISCOUNT_PERCENT / 100); // 41.3₪
        referrerBonus = REGISTRATION_FEE * (DISCOUNT_PERCENT / 100); // 41.3₪
      } else {
        console.log('Affiliate code not found or invalid:', affiliate_code);
      }
    }

    const finalAmount = amount || (REGISTRATION_FEE - affiliateDiscount);
    console.log('Final registration amount:', finalAmount, 'Discount:', affiliateDiscount);

    let paymentMethodId = null;

    // Only save token if save_card=true
    if (save_card) {
      // Encrypt token
      console.log('Encrypting Tranzila token...');
      const encryptedToken = await encryptToken(tranzila_token);

      // Check if this is the first card → set as default
      const { data: existingCards } = await supabase
        .from('payment_methods')
        .select('id')
        .eq('professional_id', professional.id);

      const isDefault = (existingCards?.length || 0) === 0;

      console.log('Saving payment method to database, is_default:', isDefault);

      // Save to payment_methods table
      const { data: paymentMethod, error: insertError } = await supabase
        .from('payment_methods')
        .insert({
          professional_id: professional.id,
          token_encrypted: encryptedToken,
          card_last4,
          expiry_month,
          expiry_year,
          is_default: isDefault
        })
        .select('id')
        .single();

      if (insertError) {
        console.error('Failed to save payment method:', insertError);

        // Log error
        await supabase.from('transaction_logs').insert({
          professional_id: professional.id,
          action: 'error',
          request: { action: 'registration_payment', phone_number, save_card },
          response: { error: insertError.message }
        });

        return new Response(
          JSON.stringify({ error: 'שגיאה בשמירת כרטיס האשראי', details: insertError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      paymentMethodId = paymentMethod.id;
      console.log('Payment method saved successfully, ID:', paymentMethodId);
    } else {
      console.log('Skipping token save (save_card=false)');
    }

    // Update professional registration payment status
    console.log('Updating professional registration payment status...');
    const { error: updateError } = await supabase
      .from('professionals')
      .update({
        registration_payment_status: 'completed',
        registration_paid_at: new Date().toISOString(),
        registration_amount: finalAmount
      })
      .eq('id', professional.id);

    if (updateError) {
      console.error('Failed to update registration payment status:', updateError);
      // Non-critical - don't fail the request
    } else {
      console.log('Registration payment status updated to completed');
    }

    // Update professional_leads_crm paid status
    console.log('Updating professional_leads_crm paid status...');
    const { error: crmUpdateError } = await supabase
      .from('professional_leads_crm')
      .update({
        paid: true,
        paid_at: new Date().toISOString(),
        payment_amount: finalAmount
      })
      .eq('professional_id', professional.id);

    if (crmUpdateError) {
      console.error('Failed to update CRM paid status:', crmUpdateError);
      // Non-critical - don't fail the request
    } else {
      console.log('CRM paid status updated to true');
    }

    // ============================================================
    // AFFILIATE BONUS PROCESSING
    // ============================================================
    let bonusCommissionId: string | null = null;

    if (referrerId && referrerBonus > 0) {
      console.log('Processing affiliate bonus for referrer:', referrerId, 'Amount:', referrerBonus);

      // Create credit commission for the referrer
      const { data: commission, error: commissionError } = await supabase
        .from('commissions')
        .insert({
          professional_id: referrerId,
          amount: referrerBonus, // Positive amount - transaction_type defines it as credit
          amount_before_vat: referrerBonus / 1.18, // Remove VAT (18%)
          commission_date: new Date().toISOString().split('T')[0],
          transaction_type: 'credit',
          payment_type: 'affiliate_bonus',
          status: 'payable',
          paid_at: new Date().toISOString(),
          ofair_commission: 0,
          lead_owner_commission: 0
        })
        .select('id')
        .single();

      if (commissionError) {
        console.error('Failed to create affiliate bonus commission:', commissionError);
        // Non-critical - don't fail the request, but log it
      } else {
        bonusCommissionId = commission.id;
        console.log('Affiliate bonus commission created:', bonusCommissionId);
      }

      // Create affiliate registration record
      const { error: affiliateError } = await supabase
        .from('affiliate_registrations')
        .insert({
          referrer_id: referrerId,
          referred_id: professional.id,
          affiliate_code_used: affiliate_code.toUpperCase().trim(),
          registration_amount: REGISTRATION_FEE,
          discount_given: affiliateDiscount,
          referrer_bonus: referrerBonus,
          bonus_commission_id: bonusCommissionId,
          status: bonusCommissionId ? 'credited' : 'completed'
        });

      if (affiliateError) {
        console.error('Failed to create affiliate registration record:', affiliateError);
        // Non-critical - don't fail the request
      } else {
        console.log('Affiliate registration record created');
      }
    }

    // Log successful transaction
    const { data: transactionLog } = await supabase.from('transaction_logs').insert({
      professional_id: professional.id,
      action: save_card ? 'tokenize' : 'charge',
      request: {
        source: 'registration',
        amount: finalAmount,
        card_last4,
        phone_number,
        save_card,
        affiliate_code: affiliate_code || null,
        affiliate_discount: affiliateDiscount
      },
      response: {
        success: true,
        code: '000',
        confirmation_code: confirmation_code || null,
        payment_method_id: paymentMethodId,
        bonus_commission_id: bonusCommissionId
      }
    }).select('id').single();

    console.log('Registration payment completed successfully');

    // Fetch the newly generated affiliate code for the new user
    const { data: updatedProfessional } = await supabase
      .from('professionals')
      .select('affiliate_code')
      .eq('id', professional.id)
      .single();

    console.log('New user affiliate code:', updatedProfessional?.affiliate_code);

    return new Response(
      JSON.stringify({
        success: true,
        payment_method_id: paymentMethodId,
        message: save_card ? 'כרטיס נשמר בהצלחה' : 'תשלום בוצע בהצלחה',
        affiliate_discount: affiliateDiscount,
        final_amount: finalAmount,
        affiliate_code: updatedProfessional?.affiliate_code // Return the new user's affiliate code
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Registration payment error:', error);

    // Attempt to log error
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      await supabase.from('transaction_logs').insert({
        action: 'error',
        request: { action: 'registration_payment_exception' },
        response: { error: error instanceof Error ? error.message : String(error) }
      });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }

    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
