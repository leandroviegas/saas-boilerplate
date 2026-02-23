'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export function useTheme() {
  let pageTheme: 'light' | 'dark' | undefined = Cookies.get('theme') as 'light' | 'dark' | undefined;

  const [theme, setTheme] = useState<'light' | 'dark'>(pageTheme ?? 'dark');

  useEffect(() => {
  const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    Cookies.set('theme', theme)
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return { theme, setTheme, toggleTheme };
}