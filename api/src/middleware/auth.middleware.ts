import { Elysia } from 'elysia';
import { authService } from "@/services";

export const authMiddleware = new Elysia({ name: 'authMiddleware' })
    .derive({ as: 'global' }, async ({ headers }) => {
        const data = await authService.session(headers);

        return {
            user: data?.user ?? null,
            session: data?.session ? {
                ...data.session,
                activeOrganizationId: data.session.activeOrganizationId || ""
            } : null
        };
    });
