import { FastifyRequest, FastifyReply } from 'fastify';
import { authService, organizationService } from "@/services";
import { AuthUser, AuthSession } from "@/auth";
import { languageEnum } from '@/enums/languageEnum';
import { Organization } from '@prisma/client';

declare module 'fastify' {
  interface FastifyRequest {
    user: AuthUser;
    session: AuthSession & { activeOrganizationId: string };
    lang: languageEnum;
  }
}

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const data = await authService.session(request.headers);

  if (data) {
    request.user = data.user;
    request.session = { ...data.session, activeOrganizationId: data.session.activeOrganizationId || "" };
  }
}
