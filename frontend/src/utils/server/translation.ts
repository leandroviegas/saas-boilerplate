import { cookies, headers } from 'next/headers';
import acceptLanguageParser from 'accept-language-parser';

export enum languageEnum {
    PT = 'pt',
    EN = 'en'
}

const locales = Object.values(languageEnum)

export async function getTranslation() {
    const cookiesList = await cookies();
    const headersList = await headers();

    let lang = languageEnum.EN;

    let cookieLang = cookiesList.get('lang')?.value;
    let acceptLanguage = headersList.get("accept-language");

    if (cookieLang) {
        lang = cookieLang as languageEnum;
    } else if (acceptLanguage) {
        const languages = acceptLanguageParser.parse(acceptLanguage);
        if (Object.values(languageEnum).includes(languages[0]?.code as languageEnum)) {
            lang = languages[0]?.code as languageEnum;
        }
    }

    let translation: { [key: string]: string };

    translation = require(`../../locales/${lang}/common.json`);

    return {
        lang,
        locales,
        translation,
        t: (key: string, replacements?: string[]): string => {
            const trasnlated = translation[key]
            if (!trasnlated) {
                console.warn(`Translation for "${key}" not found in "${lang}" locale.`);
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
        }
    }
}




