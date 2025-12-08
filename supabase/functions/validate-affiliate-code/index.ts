import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { affiliate_code } = await req.json();
    
    console.log('Validating affiliate code:', affiliate_code);

    if (!affiliate_code) {
      return new Response(
        JSON.stringify({ valid: false, error: 'קוד הפניה חסר' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create Supabase client with service role to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Normalize code (uppercase, trim)
    const normalizedCode = affiliate_code.toUpperCase().trim();

    // Search for professional with this affiliate code
    const { data: professional, error } = await supabaseAdmin
      .from('professionals')
      .select('id, name, affiliate_code')
      .eq('affiliate_code', normalizedCode)
      .eq('registration_payment_status', 'completed') // Only active/paid professionals
      .maybeSingle();

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ valid: false, error: 'שגיאה בבדיקת הקוד' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!professional) {
      console.log('Affiliate code not found:', normalizedCode);
      return new Response(
        JSON.stringify({ valid: false, error: 'קוד הפניה לא תקין' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Code is valid
    console.log('Affiliate code valid, referrer:', professional.name);
    
    const REGISTRATION_FEE = 413;
    const DISCOUNT_PERCENT = 10;
    const discountAmount = REGISTRATION_FEE * (DISCOUNT_PERCENT / 100);
    const discountedPrice = REGISTRATION_FEE - discountAmount;

    return new Response(
      JSON.stringify({
        valid: true,
        referrer_id: professional.id,
        referrer_name: professional.name,
        original_price: REGISTRATION_FEE,
        discount_percent: DISCOUNT_PERCENT,
        discount_amount: discountAmount,
        discounted_price: discountedPrice
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: unknown) {
    console.error('Error in validate-affiliate-code function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ valid: false, error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
