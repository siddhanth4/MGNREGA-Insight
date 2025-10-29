'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { locales, Locale, translations as allTranslations, Translations } from '@/lib/locales';

interface LanguageContextType {
  language: Locale;
  setLanguage: (language: string) => void;
  translations: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Locale>('en');

  const setLanguage = (lang: string) => {
    if (locales.includes(lang as Locale)) {
      setLanguageState(lang as Locale);
    }
  };

  const translations = allTranslations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
