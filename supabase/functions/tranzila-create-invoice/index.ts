import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

/**
 * Generate Tranzila invoice and send to Make.com webhook
 * Handles both registration payments and commission charges
 */

const MAKE_WEBHOOK_URL = 'https://hook.eu2.make.com/91wtmvcqm30g988p3wrixjhbqtaxwzhm';
const TRANZILA_API_URL = 'https://billing5.tranzila.com/api/documents_db/create_document';

interface InvoiceRequest {
  professional_id: string;
  transaction_log_id?: string;
  commission_id?: string;
  invoice_type: 'registration' | 'commission' | 'subscription';
  total_amount: number; // Amount AFTER VAT (what customer paid)
  description: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body: InvoiceRequest = await req.json();
    console.log('Invoice generation request:', JSON.stringify(body, null, 2));

    const {
      professional_id,
      transaction_log_id,
      commission_id,
      invoice_type,
      total_amount,
      description
    } = body;

    // Validate required fields
    if (!professional_id || !invoice_type || !total_amount || !description) {
      console.error('VALIDATION FAILED: Missing required fields');
      return new Response(
        JSON.stringify({ error: 'Missing required fields: professional_id, invoice_type, total_amount, description' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get complete professional data from database
    console.log('Fetching professional data for ID:', professional_id);
    const { data: professional, error: profError } = await supabase
      .from('professionals')
      .select('*')
      .eq('id', professional_id)
      .single();

    if (profError || !professional) {
      console.error('Professional not found:', professional_id, profError);
      return new Response(
        JSON.stringify({ error: 'Professional not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Found professional:', professional.name, professional.phone_number);

    // Calculate VAT (Israeli VAT is 18%)
    const amountBeforeVAT = total_amount / 1.18;
    const vatAmount = total_amount - amountBeforeVAT;

    console.log('Calculating VAT:', {
      total_amount,
      amountBeforeVAT: amountBeforeVAT.toFixed(2),
      vatAmount: vatAmount.toFixed(2)
    });

    // Get Tranzila credentials from secrets
    const terminalName = Deno.env.get('TRANZILA_TOKEN_TERMINAL_NAME');
    const appKey = Deno.env.get('TRANZILA_APP_KEY');
    const secretKey = Deno.env.get('TRANZILA_SECRET');

    if (!terminalName || !appKey || !secretKey) {
      console.error('Missing Tranzila credentials in environment');
      throw new Error('Tranzila billing API credentials not configured');
    }

    // Generate unique invoice number (using timestamp + professional_id suffix)
    const invoiceNumber = `INV-${Date.now()}-${professional_id.slice(0, 8)}`;
    console.log('Generated invoice number:', invoiceNumber);

    // Prepare Tranzila document creation request
    // Using Billing API (REST/JSON) as per https://docs.tranzila.com/docs/invoices/27ffheryfv066-create-document
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const requestBody = {
      terminal_name: terminalName,
      document_date: today,
      document_type: 'IR', // Invoice/Receipt (חשבונית מס/קבלה)
      document_language: 'heb',
      document_currency_code: 'ILS',
      action: 1, // 1 = Debit, 3 = Credit
      vat_percent: 18, // 18% Israeli VAT
      response_language: 'eng', // Get error messages in English

      // Customer details from professional record
      client_name: professional.name || '',
      client_email: professional.email || '',
      client_company: professional.company_name || '',
      client_id: professional.business_license_number || '', // Tax ID / Business license
      client_city: professional.city || professional.location || '',
      client_country_code: 'IL',

      // Line items array (required - describes what was purchased)
      items: [
        {
          name: description,
          unit_price: amountBeforeVAT, // Price before VAT
          units_number: 1,
          unit_type: 1, // 1 = unit
          price_type: 'G', // G = Gross (includes VAT in calculation)
          currency_code: 'ILS',
          to_doc_currency_exchange_rate: 1
        }
      ],

      // Payment details array (required - how customer paid)
      payments: [
        {
          payment_method: 1, // 1 = Credit Card
          payment_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
          amount: total_amount, // Total amount paid (after VAT)
          currency_code: 'ILS',
          to_doc_currency_exchange_rate: 1
        }
      ]
    };

    console.log('Calling Tranzila billing API with request:', {
      terminal_name: terminalName,
      document_type: 'IR',
      client_name: professional.name,
      client_email: professional.email,
      total_amount: total_amount.toFixed(2),
      items_count: requestBody.items.length
    });
    console.log('Full request body:', JSON.stringify(requestBody, null, 2));

    // Generate nonce and timestamp for API authentication
    const nonce = crypto.randomUUID();
    const timestamp = Math.floor(Date.now() / 1000).toString();

    // Call Tranzila Billing API (REST/JSON)
    const tranzilaResponse = await fetch(TRANZILA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-tranzila-api-access-token': secretKey, // Secret key for authentication
        'X-tranzila-api-app-key': appKey, // App key
        'X-tranzila-api-nonce': nonce, // Random UUID for request uniqueness
        'X-tranzila-api-request-time': timestamp // Unix timestamp
      },
      body: JSON.stringify(requestBody)
    });

    const tranzilaText = await tranzilaResponse.text();
    console.log('Tranzila response status:', tranzilaResponse.status);
    console.log('Tranzila response headers:', Object.fromEntries(tranzilaResponse.headers.entries()));
    console.log('Tranzila response body:', tranzilaText);
    console.log('Tranzila response body length:', tranzilaText.length);

    // Parse Tranzila response (JSON format)
    let tranzilaData: any = {};
    try {
      tranzilaData = JSON.parse(tranzilaText);
    } catch (parseError) {
      console.error('Failed to parse Tranzila response as JSON:', parseError);
      console.error('Response was:', tranzilaText.substring(0, 500)); // First 500 chars
      tranzilaData = {
        status_code: 999,
        status_msg: tranzilaText.substring(0, 200) || 'Invalid JSON response',
        raw: tranzilaText,
        http_status: tranzilaResponse.status
      };
    }

    // Check if invoice creation was successful
    // Success: status_code = 0, response includes document details
    const isSuccess = tranzilaData.status_code === 0;

    console.log('Tranzila parsed response:', {
      status_code: tranzilaData.status_code,
      status_msg: tranzilaData.status_msg,
      success: isSuccess,
      document_id: tranzilaData.document?.id,
      document_number: tranzilaData.document?.number,
      retrieval_key: tranzilaData.document?.retrieval_key
    });

    // Save invoice to database
    const invoiceData = {
      professional_id,
      transaction_log_id: transaction_log_id || null,
      commission_id: commission_id || null,
      invoice_number: invoiceNumber,
      invoice_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      invoice_type,
      amount: parseFloat(amountBeforeVAT.toFixed(2)),
      vat_amount: parseFloat(vatAmount.toFixed(2)),
      total_amount,
      description,
      tranzila_invoice_id: tranzilaData.document?.id || null,
      tranzila_document_number: tranzilaData.document?.number || null,
      tranzila_response: tranzilaData,
      pdf_url: tranzilaData.document?.retrieval_key ?
        `https://billing5.tranzila.com/api/documents_db/get_document?key=${tranzilaData.document.retrieval_key}` : null,
      status: isSuccess ? 'generated' : 'failed',
      error_message: isSuccess ? null : (tranzilaData.status_msg || 'Unknown error')
    };

    console.log('Saving invoice to database:', invoiceData);

    const { data: savedInvoice, error: insertError } = await supabase
      .from('invoices')
      .insert(invoiceData)
      .select('id, invoice_number, status')
      .single();

    if (insertError) {
      console.error('Failed to save invoice to database:', insertError);
      // Non-critical - continue to webhook even if DB save fails
    } else {
      console.log('Invoice saved successfully:', savedInvoice);
    }

    // Send to Make.com webhook (COMPLETE professional data + invoice)
    console.log('Sending to Make.com webhook...');

    const webhookPayload = {
      // Invoice data
      invoice: {
        id: savedInvoice?.id,
        invoice_number: invoiceNumber,
        invoice_type,
        amount_before_vat: amountBeforeVAT.toFixed(2),
        vat_amount: vatAmount.toFixed(2),
        total_amount: total_amount.toFixed(2),
        description,
        status: isSuccess ? 'generated' : 'failed',
        pdf_url: tranzilaData['pdf_url'] || null,
        tranzila_document_number: tranzilaData['doc_number'] || null,
        created_at: new Date().toISOString()
      },
      // COMPLETE professional data (as requested by user)
      professional: {
        ...professional, // Spread ALL professional fields
        id: professional_id // Ensure ID is included
      },
      // Metadata
      timestamp: new Date().toISOString(),
      source: 'tranzila-create-invoice'
    };

    try {
      const webhookResponse = await fetch(MAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookPayload)
      });

      const webhookResponseText = await webhookResponse.text();
      console.log('Make.com webhook response:', webhookResponse.status, webhookResponseText);

      // Update invoice with webhook status
      if (savedInvoice?.id) {
        await supabase
          .from('invoices')
          .update({
            webhook_sent_at: new Date().toISOString(),
            webhook_response: {
              status: webhookResponse.status,
              body: webhookResponseText
            },
            status: isSuccess && webhookResponse.ok ? 'sent' : (isSuccess ? 'generated' : 'failed')
          })
          .eq('id', savedInvoice.id);
      }

    } catch (webhookError) {
      console.error('Failed to send to Make.com webhook:', webhookError);
      // Non-blocking - don't throw error
    }

    console.log('Invoice generation completed successfully');

    return new Response(
      JSON.stringify({
        success: isSuccess,
        invoice_id: savedInvoice?.id,
        invoice_number: invoiceNumber,
        pdf_url: invoiceData.pdf_url,
        document_id: tranzilaData.document?.id,
        document_number: tranzilaData.document?.number,
        message: isSuccess ? 'חשבונית נוצרה בהצלחה' : 'שגיאה ביצירת החשבונית'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Invoice generation error:', error);

    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
