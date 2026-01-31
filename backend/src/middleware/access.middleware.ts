import { FastifyReply, FastifyRequest } from "fastify/fastify";

export async function accessMiddleware(request: FastifyRequest, reply: FastifyReply, roles: string[]) {
    if (!request.user?.role || !roles.includes(request.user.role)) {
        return reply.status(403).send({ code: "UNAUTHORIZED" });
    }
}
