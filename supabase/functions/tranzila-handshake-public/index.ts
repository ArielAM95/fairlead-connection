import { corsHeaders } from '../_shared/cors.ts';

/**
 * Public Tranzila Handshake - No Authentication Required
 * Used for registration flow where user is not logged in yet
 */

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('Public handshake request received');

    // Get terminal credentials
    const rawTerminal = Deno.env.get('TRANZILA_TOKEN_TERMINAL_NAME')?.trim() ||
                        Deno.env.get('TRANZILA_TERMINAL_NAME')?.trim() || '';
    const rawPassword = Deno.env.get('TRANZILA_TOKEN_TERMINAL_PASSWORD')?.trim() ||
                        Deno.env.get('TRANZILA_TERMINAL_PASSWORD')?.trim() ||
                        Deno.env.get('TRANZILA_PW')?.trim() || '';

    // Sanitize terminal name - remove special chars
    const terminal = rawTerminal.replace(/[^a-zA-Z0-9_-]/g, '');
    // Remove surrounding quotes if present
    const password = rawPassword.replace(/^['"]|['"]$/g, '');

    console.log('Terminal name sanitized:', terminal, 'Length:', terminal.length);

    // Validation
    if (!terminal || !password) {
      console.error('MISSING CREDENTIALS! Terminal:', !!terminal, 'Password:', !!password);
      throw new Error('TRANZILA_TERMINAL_NAME or TRANZILA_TERMINAL_PASSWORD not configured');
    }

    // Build request URL with query parameters
    const url = new URL('https://api.tranzila.com/v1/handshake/create');
    url.searchParams.set('supplier', terminal);
    url.searchParams.set('TranzilaPW', password);
    url.searchParams.set('sum', '1.00');
    url.searchParams.set('currency', '1');

    console.log('Calling Tranzila handshake API with GET...');

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: { 'Accept': 'text/plain' }
    });

    const text = await response.text();
    console.log('Response status:', response.status, 'body:', text);

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: 'Tranzila handshake failed', status: response.status, body: text }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const match = text.match(/thtk=([^&\s]+)/);
    if (!match) {
      console.error('Failed to extract handshake token from response:', text);
      throw new Error('Failed to extract handshake token');
    }

    console.log('Handshake successful, returning token');

    return new Response(
      JSON.stringify({
        success: true,
        handshakeToken: match[1],
        terminal
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Public handshake error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
