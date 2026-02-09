'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from './useTranslation';
import Cookies from 'js-cookie';
import { LangsEnum } from '@/enums/LangsEnum';

const supportedLocales = Object.values(LangsEnum);

export function useLanguage() {
  const { locale } = useTranslation();
  const router = useRouter();
  const [currentLocale, setCurrentLocale] = useState(locale);

  useEffect(() => {
    setCurrentLocale(locale);
  }, [locale]);

  const changeLanguage = (newLocale: LangsEnum) => {
    Cookies.set('lang', newLocale);
    setCurrentLocale(newLocale);
    router.refresh();
  };

  const toggleLanguage = () => {
    changeLanguage(currentLocale);
  };

  return {
    currentLocale,
    changeLanguage,
    toggleLanguage,
    supportedLocales
  };
}