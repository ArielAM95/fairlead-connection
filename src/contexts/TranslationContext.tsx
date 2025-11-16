import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  rtl: boolean;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', rtl: true },
  { code: 'en', name: 'English', nativeName: 'English', rtl: false },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', rtl: true },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', rtl: false },
  { code: 'es', name: 'Spanish', nativeName: 'Español', rtl: false },
  { code: 'fr', name: 'French', nativeName: 'Français', rtl: false },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', rtl: false },
  { code: 'ti', name: 'Tigrinya', nativeName: 'ትግርኛ', rtl: false },
];

interface TranslationCache {
  [key: string]: string;
}

interface TranslationContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  translate: (text: string) => string;
  translateBatch: (texts: string[]) => Promise<string[]>;
  isTranslating: boolean;
  isRTL: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

const CACHE_KEY = 'ofair_translations';
const LANGUAGE_KEY = 'ofair_language';

// In-memory cache for faster access
let memoryCache: { [lang: string]: TranslationCache } = {};

function loadCacheFromStorage(): { [lang: string]: TranslationCache } {
  try {
    const stored = localStorage.getItem(CACHE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Failed to load translation cache:', e);
  }
  return {};
}

function saveCacheToStorage(cache: { [lang: string]: TranslationCache }) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.warn('Failed to save translation cache:', e);
  }
}

function loadLanguageFromStorage(): Language {
  try {
    const stored = localStorage.getItem(LANGUAGE_KEY);
    if (stored) {
      const lang = JSON.parse(stored);
      const found = SUPPORTED_LANGUAGES.find(l => l.code === lang.code);
      if (found) return found;
    }
  } catch (e) {
    console.warn('Failed to load language preference:', e);
  }
  return SUPPORTED_LANGUAGES[0]; // Hebrew default
}

function saveLanguageToStorage(lang: Language) {
  try {
    localStorage.setItem(LANGUAGE_KEY, JSON.stringify(lang));
  } catch (e) {
    console.warn('Failed to save language preference:', e);
  }
}

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(loadLanguageFromStorage);
  const [isTranslating, setIsTranslating] = useState(false);
  const [pendingTranslations, setPendingTranslations] = useState<Map<string, Promise<string>>>(new Map());

  // Load cache on mount
  useEffect(() => {
    memoryCache = loadCacheFromStorage();
  }, []);

  // Update document direction when language changes
  useEffect(() => {
    document.documentElement.lang = currentLanguage.code;
    document.documentElement.dir = currentLanguage.rtl ? 'rtl' : 'ltr';
    document.body.style.direction = currentLanguage.rtl ? 'rtl' : 'ltr';
  }, [currentLanguage]);

  const setLanguage = useCallback((lang: Language) => {
    setCurrentLanguage(lang);
    saveLanguageToStorage(lang);
  }, []);

  const getCachedTranslation = useCallback((text: string, targetLang: string): string | null => {
    if (targetLang === 'he') return text; // Hebrew is source, no translation needed

    const langCache = memoryCache[targetLang];
    if (langCache && langCache[text]) {
      return langCache[text];
    }
    return null;
  }, []);

  const setCachedTranslation = useCallback((text: string, translation: string, targetLang: string) => {
    if (!memoryCache[targetLang]) {
      memoryCache[targetLang] = {};
    }
    memoryCache[targetLang][text] = translation;
    saveCacheToStorage(memoryCache);
  }, []);

  const translateBatch = useCallback(async (texts: string[]): Promise<string[]> => {
    if (currentLanguage.code === 'he') {
      return texts; // No translation needed for Hebrew
    }

    // Check cache first
    const uncachedTexts: string[] = [];
    const uncachedIndices: number[] = [];
    const results: string[] = new Array(texts.length);

    texts.forEach((text, index) => {
      const cached = getCachedTranslation(text, currentLanguage.code);
      if (cached) {
        results[index] = cached;
      } else {
        uncachedTexts.push(text);
        uncachedIndices.push(index);
      }
    });

    if (uncachedTexts.length === 0) {
      return results;
    }

    setIsTranslating(true);

    try {
      const { data, error } = await supabase.functions.invoke('google-translate', {
        body: {
          texts: uncachedTexts,
          targetLanguage: currentLanguage.code,
          sourceLanguage: 'he'
        }
      });

      if (error) {
        console.error('Translation API error:', error);
        // Return original texts on error
        uncachedIndices.forEach((originalIndex, i) => {
          results[originalIndex] = uncachedTexts[i];
        });
        return results;
      }

      if (data.success && data.translations) {
        uncachedIndices.forEach((originalIndex, i) => {
          const translation = data.translations[i];
          results[originalIndex] = translation;
          setCachedTranslation(uncachedTexts[i], translation, currentLanguage.code);
        });
      } else {
        uncachedIndices.forEach((originalIndex, i) => {
          results[originalIndex] = uncachedTexts[i];
        });
      }

      return results;
    } catch (err) {
      console.error('Translation error:', err);
      uncachedIndices.forEach((originalIndex, i) => {
        results[originalIndex] = uncachedTexts[i];
      });
      return results;
    } finally {
      setIsTranslating(false);
    }
  }, [currentLanguage, getCachedTranslation, setCachedTranslation]);

  const translate = useCallback((text: string): string => {
    if (currentLanguage.code === 'he') {
      return text;
    }

    const cached = getCachedTranslation(text, currentLanguage.code);
    if (cached) {
      return cached;
    }

    // Queue for async translation but return original for now
    // The component should use translateBatch for proper async handling
    return text;
  }, [currentLanguage, getCachedTranslation]);

  const value: TranslationContextType = {
    currentLanguage,
    setLanguage,
    translate,
    translateBatch,
    isTranslating,
    isRTL: currentLanguage.rtl
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}
