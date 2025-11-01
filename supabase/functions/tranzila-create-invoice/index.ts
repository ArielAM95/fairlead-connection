import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

/**
 * Generate Tranzila invoice and send to Make.com webhook
 * Handles both registration payments and commission charges
 */

const MAKE_WEBHOOK_URL = 'https://hook.eu2.make.com/91wtmvcqm30g988p3wrixjhbqtaxwzhm';
const TRANZILA_API_URL = 'https://secure5.tranzila.com/cgi-bin/tranzila71u.cgi';

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
    const terminalPassword = Deno.env.get('TRANZILA_TOKEN_TERMINAL_PASSWORD');

    if (!terminalName || !terminalPassword) {
      console.error('Missing Tranzila credentials in environment');
      throw new Error('Tranzila credentials not configured');
    }

    // Generate unique invoice number (using timestamp + professional_id suffix)
    const invoiceNumber = `INV-${Date.now()}-${professional_id.slice(0, 8)}`;
    console.log('Generated invoice number:', invoiceNumber);

    // Prepare Tranzila document creation request
    // Using document API (tranmode: VK) as per https://docs.tranzila.com/docs/invoices/27ffheryfv066-create-document
    const tranzilaParams = new URLSearchParams({
      supplier: terminalName,
      TranzilaPW: terminalPassword, // Use TranzilaPW for document API (not tranzilaTK)
      tranmode: 'VK', // Create document
      sum: total_amount.toFixed(2),
      currency: '1', // ILS

      // Customer details from professional record
      contact: professional.name || '',
      email: professional.email || '',
      phone: professional.phone_number || '',
      city: professional.city || professional.location || '',
      company: professional.company_name || '',
      TaxId: professional.business_license_number || '', // CRITICAL: Use existing field as tax_id

      // Invoice details
      doctype: '1', // Tax invoice (קבלה/חשבונית מס)
      remarks: description,

      // Line items (single line for simplicity)
      item_name_1: description,
      item_amount_1: amountBeforeVAT.toFixed(2),
      item_quantity_1: '1',
      item_vat_1: '18', // 18% Israeli VAT
    });

    console.log('Calling Tranzila document API with params:', {
      supplier: terminalName,
      tranmode: 'VK',
      sum: total_amount.toFixed(2),
      TaxId: professional.business_license_number,
      email: professional.email,
      doctype: '1'
    });

    // Call Tranzila API
    const tranzilaResponse = await fetch(TRANZILA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tranzilaParams.toString()
    });

    const tranzilaText = await tranzilaResponse.text();
    console.log('Tranzila response:', tranzilaText);

    // Parse Tranzila response (key=value format)
    const tranzilaData: Record<string, string> = {};
    tranzilaText.split('&').forEach(pair => {
      const [key, value] = pair.split('=');
      if (key && value) {
        tranzilaData[key] = decodeURIComponent(value);
      }
    });

    // Check if invoice creation was successful
    const responseCode = tranzilaData['Response'] || tranzilaData['code'];
    const isSuccess = responseCode === '000' || responseCode === '0';

    console.log('Tranzila parsed response:', {
      code: responseCode,
      success: isSuccess,
      doc_id: tranzilaData['doc_id'],
      pdf_url: tranzilaData['pdf_url']
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
      tranzila_invoice_id: tranzilaData['doc_id'] || null,
      tranzila_document_number: tranzilaData['doc_number'] || null,
      tranzila_response: tranzilaData,
      pdf_url: tranzilaData['pdf_url'] || null,
      status: isSuccess ? 'generated' : 'failed',
      error_message: isSuccess ? null : (tranzilaData['message'] || 'Unknown error')
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
        pdf_url: tranzilaData['pdf_url'] || null,
        message: isSuccess ? 'חשבונית נוצרה בהצלחה' : 'שגיאה ביצירת החשבונית'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Invoice generation error:', error);

    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
