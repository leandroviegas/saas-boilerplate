'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from './useTranslation';
import Cookies from 'js-cookie';

const supportedLocales = ['en', 'pt'];

export function useLanguage() {
  const { locale } = useTranslation();
  const router = useRouter();
  const [currentLocale, setCurrentLocale] = useState(locale);

  useEffect(() => {
    setCurrentLocale(locale);
  }, [locale]);

  const changeLanguage = (newLocale: string) => {
    Cookies.set('lang', newLocale);
    setCurrentLocale(newLocale);
    router.refresh();
  };

  const toggleLanguage = () => {
    const newLocale = currentLocale === 'en' ? 'pt' : 'en';
    changeLanguage(newLocale);
  };

  return {
    currentLocale,
    changeLanguage,
    toggleLanguage,
    supportedLocales
  };
}