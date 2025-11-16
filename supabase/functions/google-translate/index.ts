import { corsHeaders } from '../_shared/cors.ts';

/**
 * Google Cloud Translation API Proxy
 * Hides API key from client and provides caching layer
 */

interface TranslateRequest {
  texts: string[];
  targetLanguage: string;
  sourceLanguage?: string;
}

interface GoogleTranslateResponse {
  data: {
    translations: Array<{
      translatedText: string;
      detectedSourceLanguage?: string;
    }>;
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('GOOGLE_TRANSLATE_API_KEY');

    if (!apiKey) {
      console.error('GOOGLE_TRANSLATE_API_KEY not configured');
      throw new Error('Translation service not configured');
    }

    const body: TranslateRequest = await req.json();
    const { texts, targetLanguage, sourceLanguage = 'he' } = body;

    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      throw new Error('texts array is required');
    }

    if (!targetLanguage) {
      throw new Error('targetLanguage is required');
    }

    // Limit batch size to avoid API limits
    if (texts.length > 128) {
      throw new Error('Maximum 128 texts per request');
    }

    console.log(`Translating ${texts.length} texts from ${sourceLanguage} to ${targetLanguage}`);

    // Build Google Translate API request
    const url = new URL('https://translation.googleapis.com/language/translate/v2');
    url.searchParams.set('key', apiKey);

    const requestBody = {
      q: texts,
      target: targetLanguage,
      source: sourceLanguage,
      format: 'text'
    };

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Translate API error:', response.status, errorText);
      throw new Error(`Translation API error: ${response.status}`);
    }

    const result: GoogleTranslateResponse = await response.json();

    const translations = result.data.translations.map(t => t.translatedText);

    console.log(`Successfully translated ${translations.length} texts`);

    return new Response(
      JSON.stringify({
        success: true,
        translations,
        sourceLanguage,
        targetLanguage
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Translation error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : String(error),
        success: false
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
