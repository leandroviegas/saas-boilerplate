import { translate } from "@/locales";
import { FastifyReply, FastifyRequest } from "fastify/fastify";

export async function responseMessageHandler(request: FastifyRequest, reply: FastifyReply, payload: any) {
    if (request.url.startsWith('/static/') || request.url.startsWith('/docs')) {
        return payload;
    }
    try {
        const parsed = typeof payload === 'string' ? JSON.parse(payload) : payload;

        if (parsed && typeof parsed === 'object' && 'code' in parsed && typeof parsed.code === 'string') {
            const locale = request.lang;
            parsed.message = translate(locale, parsed.code);
        }

        return JSON.stringify(parsed);
    } catch (e) {
        return payload;
    }
}