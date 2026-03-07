import { Elysia } from 'elysia';
import acceptLanguageParser from 'accept-language-parser';
import { languageEnum } from '@/enums/language-enum';
import { publicConfig } from '@/config';

export const mainMiddleware = new Elysia({ name: 'mainMiddleware' })
    .derive({ as: 'global' }, ({ headers, cookie: { lang: cookieLang } }) => {
        let lang = publicConfig.defaultLang;
        let acceptLanguage = headers["accept-language"];

        if (cookieLang?.value) {
            lang = cookieLang.value as languageEnum;
        } else if (acceptLanguage) {
            const languages = acceptLanguageParser.parse(acceptLanguage);
            if (Object.values(languageEnum).includes(languages[0]?.code as languageEnum)) {
                lang = languages[0]?.code as languageEnum;
            }
        }

        return {
            lang
        };
    });
