'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/app/providers/LanguageProvider';

export function LanguageHtmlWrapper() {
  const { language } = useLanguage();

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  return null;
}
