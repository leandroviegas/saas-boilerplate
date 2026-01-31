import { FastifyRequest, FastifyReply } from 'fastify';
import { authService } from "@/services";
import { AuthUser, AuthSession } from "@/auth";
import { prisma } from '@/plugins/prisma';
import { languageEnum } from '@/enums/languageEnum';

declare module 'fastify' {
  interface FastifyRequest {
    user: AuthUser;
    session: AuthSession;
    lang: languageEnum;
  }
}

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const data = await authService.session(request.headers);

  if (data) {
    request.user = data.user;
    request.session = data.session;
  }
}
