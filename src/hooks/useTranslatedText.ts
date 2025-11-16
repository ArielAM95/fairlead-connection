import { useState, useEffect } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';

/**
 * Hook for translating a single text string
 * Returns the translated text (or original while loading)
 */
export function useTranslatedText(text: string): string {
  const { currentLanguage, translateBatch } = useTranslation();
  const [translated, setTranslated] = useState(text);

  useEffect(() => {
    if (currentLanguage.code === 'he') {
      setTranslated(text);
      return;
    }

    let cancelled = false;

    translateBatch([text]).then(([result]) => {
      if (!cancelled) {
        setTranslated(result);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [text, currentLanguage.code, translateBatch]);

  return translated;
}

/**
 * Hook for translating multiple texts at once
 * More efficient than multiple useTranslatedText calls
 */
export function useTranslatedTexts(texts: string[]): string[] {
  const { currentLanguage, translateBatch } = useTranslation();
  const [translated, setTranslated] = useState<string[]>(texts);

  useEffect(() => {
    if (currentLanguage.code === 'he') {
      setTranslated(texts);
      return;
    }

    let cancelled = false;

    translateBatch(texts).then((results) => {
      if (!cancelled) {
        setTranslated(results);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [texts, currentLanguage.code, translateBatch]);

  return translated;
}

/**
 * Hook for translating an object with string values
 * Useful for forms, labels, etc.
 */
export function useTranslatedObject<T extends Record<string, string>>(obj: T): T {
  const { currentLanguage, translateBatch } = useTranslation();
  const [translated, setTranslated] = useState<T>(obj);

  useEffect(() => {
    if (currentLanguage.code === 'he') {
      setTranslated(obj);
      return;
    }

    let cancelled = false;

    const keys = Object.keys(obj);
    const values = Object.values(obj);

    translateBatch(values).then((translatedValues) => {
      if (!cancelled) {
        const result = {} as T;
        keys.forEach((key, index) => {
          (result as Record<string, string>)[key] = translatedValues[index];
        });
        setTranslated(result);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [obj, currentLanguage.code, translateBatch]);

  return translated;
}
