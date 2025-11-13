import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { es } from '../locales/es';
import { en } from '../locales/en';

export const translations = { es, en };

type Locale = keyof typeof translations;

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

export const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>('es');

  useEffect(() => {
    const savedLocale = localStorage.getItem('cariocai-locale') as Locale;
    if (savedLocale && translations[savedLocale]) {
      setLocale(savedLocale);
    }
  }, []);

  const setLocaleAndSave = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('cariocai-locale', newLocale);
  };

  const t = (key: string, vars?: Record<string, string | number>) => {
    let text = translations[locale][key as keyof typeof translations[Locale]] || key;
    if (vars) {
        Object.keys(vars).forEach(varKey => {
            const regex = new RegExp(`{${varKey}}`, 'g');
            text = text.replace(regex, String(vars[varKey]));
        });
    }
    return text;
  };
  

  return (
    <I18nContext.Provider value={{ locale, setLocale: setLocaleAndSave, t }}>
      {children}
    </I18nContext.Provider>
  );
};
