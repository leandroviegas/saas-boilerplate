'use client';
import { LangsEnum } from '@/enums/LangsEnum';
import { createContext } from 'react';

export interface TranslationContextProps {
    t: (arg0: string, replacements?: string[]) => string,
    locale: LangsEnum
}

export const TranslationContext = createContext<TranslationContextProps | null>(null);

export const TranslationProvider = ({ children, translation, locale }: { children: React.ReactNode, translation: { [key: string]: string }, locale: LangsEnum }) => {
    const t = (key: string, replacements?: string[]): string => {
        const trasnlated = translation[key]
        if (!trasnlated) {
            console.warn(`Translation for "${key}" not found in "${locale}" locale.`);
        }
        
        let result = trasnlated || key;
        
        if (replacements && replacements.length > 0) {
            let replacementIndex = 0;
            result = result.replace(/#\?/g, (match) => {
                if (replacementIndex < replacements.length) {
                    return replacements[replacementIndex++];
                }
                return match;
            });
        }
        
        return result;
    };

    return (
        <TranslationContext.Provider value={{ t, locale }}>
            {children}
        </TranslationContext.Provider>
    );
};