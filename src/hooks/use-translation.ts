'use client';

import { useLanguage } from '@/context/app-context';
import en from '@/locales/en.json';
import ja from '@/locales/ja.json';

const translations = {
  en,
  ja,
};

type TranslationKey = keyof typeof en;

export function useTranslation() {
  const { language, setLanguage } = useLanguage();

  const t = (key: TranslationKey, replacements?: Record<string, string | number>) => {
    let translation = translations[language][key] || translations['en'][key];
    
    if (replacements) {
      Object.entries(replacements).forEach(([key, value]) => {
        translation = translation.replace(`{{${key}}}`, String(value));
      });
    }

    return translation;
  };

  return { t, language, setLanguage };
}
