import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

/**
 * Retry failed invoice generation
 *
 * Usage:
 * 1. Retry single invoice by ID:
 *    POST /retry-failed-invoices { "invoice_id": "uuid" }
 *
 * 2. Retry all failed invoices:
 *    POST /retry-failed-invoices { "retry_all": true }
 *
 * 3. Retry all failed invoices from last N hours:
 *    POST /retry-failed-invoices { "retry_all": true, "hours": 24 }
 */

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 🔒 SECURITY: Require service role key (admin only)
    const authHeader = req.headers.get('Authorization');
    const providedKey = authHeader?.replace('Bearer ', '');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!authHeader || providedKey !== serviceRoleKey) {
      console.error('Unauthorized retry attempt - service role key required');
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Service role key required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const body = await req.json();
    const { invoice_id, retry_all = false, hours = 24 } = body;

    console.log('Retry request:', { invoice_id, retry_all, hours });

    let invoicesToRetry: any[] = [];

    if (invoice_id) {
      // Retry single invoice
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', invoice_id)
        .eq('status', 'failed')
        .single();

      if (error || !data) {
        return new Response(
          JSON.stringify({ error: 'Invoice not found or not in failed status' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      invoicesToRetry = [data];
    } else if (retry_all) {
      // Retry all failed invoices from last N hours
      const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('status', 'failed')
        .gte('created_at', cutoffTime)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to fetch invoices:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to fetch invoices' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      invoicesToRetry = data || [];
    } else {
      return new Response(
        JSON.stringify({ error: 'Must provide either invoice_id or retry_all=true' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Retrying ${invoicesToRetry.length} failed invoices...`);

    const results = {
      total: invoicesToRetry.length,
      success: 0,
      failed: 0,
      details: [] as any[]
    };

    // Retry each invoice
    for (const invoice of invoicesToRetry) {
      console.log(`Retrying invoice ${invoice.invoice_number} (${invoice.id})`);

      try {
        // Call the invoice creation function with the same parameters
        const { data: retryResult, error: retryError } = await supabase.functions.invoke(
          'tranzila-create-invoice',
          {
            body: {
              professional_id: invoice.professional_id,
              transaction_log_id: invoice.transaction_log_id,
              commission_id: invoice.commission_id,
              invoice_type: invoice.invoice_type,
              total_amount: invoice.total_amount,
              description: invoice.description
            }
          }
        );

        if (retryError) {
          console.error(`Retry failed for ${invoice.invoice_number}:`, retryError);
          results.failed++;
          results.details.push({
            invoice_number: invoice.invoice_number,
            status: 'failed',
            error: retryError.message
          });

          // Mark as retry attempted
          await supabase
            .from('invoices')
            .update({
              error_message: `Retry failed: ${retryError.message}`,
              updated_at: new Date().toISOString()
            })
            .eq('id', invoice.id);
        } else {
          console.log(`Retry successful for ${invoice.invoice_number}`);
          results.success++;
          results.details.push({
            invoice_number: invoice.invoice_number,
            status: 'success',
            new_invoice_id: retryResult?.invoice_id
          });

          // Delete the old failed invoice record (new one was created by the function)
          await supabase
            .from('invoices')
            .delete()
            .eq('id', invoice.id);
        }
      } catch (error) {
        console.error(`Exception retrying ${invoice.invoice_number}:`, error);
        results.failed++;
        results.details.push({
          invoice_number: invoice.invoice_number,
          status: 'error',
          error: error.message
        });
      }
    }

    console.log('Retry results:', results);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Retried ${results.total} invoices: ${results.success} succeeded, ${results.failed} failed`,
        results
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Retry error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
