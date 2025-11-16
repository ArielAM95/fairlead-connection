import React from 'react';
import { useTranslatedText } from '@/hooks/useTranslatedText';

interface TProps {
  children: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

/**
 * T (Translate) component - wraps text for automatic translation
 *
 * Usage:
 * <T>שלום עולם</T>
 * <T as="span">טקסט בתוך span</T>
 * <T as="h1" className="text-2xl">כותרת מתורגמת</T>
 */
export function T({ children, as: Component = 'span', className }: TProps) {
  const translatedText = useTranslatedText(children);

  return <Component className={className}>{translatedText}</Component>;
}

/**
 * Shorthand for translating text without wrapper element
 * Returns translated string directly
 */
export function useT(text: string): string {
  return useTranslatedText(text);
}
