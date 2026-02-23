import { FastifyReply, FastifyRequest } from "fastify/fastify";
import acceptLanguageParser from 'accept-language-parser';
import { languageEnum } from "@/enums/languageEnum";
import { publicConfig } from "@/config";

export async function mainMiddleware(request: FastifyRequest, reply: FastifyReply) {
    let lang = publicConfig.defaultLang;
    let cookieLang = request.cookies?.lang;
    let acceptLanguage = request.headers["accept-language"];

    if (cookieLang) {
        lang = cookieLang as languageEnum;
    } else if (acceptLanguage) {
        const languages = acceptLanguageParser.parse(acceptLanguage);
        if (Object.values(languageEnum).includes(languages[0]?.code as languageEnum)) {
            lang = languages[0]?.code as languageEnum;
        }
    }
    request.lang = lang;
}