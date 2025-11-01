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
      amount
    } = body;

    console.log('Extracted values:', {
      phone_number,
      tranzila_token_length: tranzila_token?.length,
      card_last4,
      card_last4_type: typeof card_last4,
      expiry_month,
      expiry_year,
      confirmation_code,
      amount
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
        request: { action: 'registration_payment', phone_number },
        response: { error: insertError.message }
      });

      return new Response(
        JSON.stringify({ error: 'שגיאה בשמירת כרטיס האשראי', details: insertError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Payment method saved successfully, ID:', paymentMethod.id);

    // Update professional registration payment status
    console.log('Updating professional registration payment status...');
    const { error: updateError } = await supabase
      .from('professionals')
      .update({
        registration_payment_status: 'completed',
        registration_paid_at: new Date().toISOString(),
        registration_amount: amount || 413
      })
      .eq('id', professional.id);

    if (updateError) {
      console.error('Failed to update registration payment status:', updateError);
      // Non-critical - don't fail the request
    } else {
      console.log('Registration payment status updated to completed');
    }

    // Log successful transaction
    const { data: transactionLog } = await supabase.from('transaction_logs').insert({
      professional_id: professional.id,
      action: 'tokenize',
      request: {
        source: 'registration',
        amount: amount || 413,
        card_last4,
        phone_number
      },
      response: {
        success: true,
        code: '000',
        confirmation_code: confirmation_code || null,
        payment_method_id: paymentMethod.id
      }
    }).select('id').single();

    console.log('Registration payment completed successfully');

    // TODO: Enable invoice generation after Tranzila activates Document API
    // Generate invoice (non-blocking - don't fail payment if invoice fails)
    // DISABLED: Tranzila Document API returns HTML error - feature not enabled on terminal
    // Contact Tranzila support to enable Document API (tranmode: VK)
    /*
    try {
      console.log('Generating invoice for registration payment...');

      const invoiceResponse = await supabase.functions.invoke('tranzila-create-invoice', {
        body: {
          professional_id: professional.id,
          transaction_log_id: transactionLog?.id || null,
          invoice_type: 'registration',
          total_amount: amount || 413,
          description: `דמי הרשמה - oFair - ${professional.name}`
        }
      });

      if (invoiceResponse.error) {
        console.error('Invoice generation failed (non-blocking):', invoiceResponse.error);
      } else {
        console.log('Invoice generated successfully:', invoiceResponse.data);
      }
    } catch (invoiceError) {
      console.error('Invoice generation exception (non-blocking):', invoiceError);
      // Don't throw - invoice generation failures shouldn't break payment
    }
    */
    console.log('Invoice generation disabled - waiting for Tranzila Document API activation');

    return new Response(
      JSON.stringify({
        success: true,
        payment_method_id: paymentMethod.id,
        message: 'כרטיס נשמר בהצלחה'
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
        response: { error: error.message }
      });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }

    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
