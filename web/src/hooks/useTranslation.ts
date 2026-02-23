
import { useContext } from 'react';
import { TranslationContext } from '@/context/TranslationContext';

export const useTranslation = () => {
  const context = useContext(TranslationContext);

  if (!context) {
    throw Error('translation context error')
  }

  return context;

};


