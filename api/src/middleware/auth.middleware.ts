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
    let organization: Organization | null = null;

    if (data.session.activeOrganizationId)
      organization = await organizationService.findById(data.session.activeOrganizationId);
    else
      organization = await organizationService.findFirstByOwner(data.user.id);

    request.user = data.user;
    request.session = { ...data.session, activeOrganizationId: organization.id || "" };
  }
}
