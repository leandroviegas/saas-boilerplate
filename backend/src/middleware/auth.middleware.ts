import { FastifyRequest, FastifyReply } from 'fastify';
import { authService } from "@/services";
import { AuthUser, AuthSession } from "@/auth";
import { languageEnum } from '@/enums/languageEnum';
import { Member } from '@prisma/client';

declare module 'fastify' {
  interface FastifyRequest {
    user: AuthUser;
    member: Member;
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
