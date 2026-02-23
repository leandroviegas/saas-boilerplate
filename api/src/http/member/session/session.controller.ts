import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { sessionService } from "@/services";
import { routesSchema, RevokeSessionParamsType } from "./session.schemas";

export async function sessionController(fastify: FastifyInstance) {
  fastify.get(
    "/",
    {
      schema: routesSchema.getAllSessions,
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const sessions = await sessionService.findAllByUserId(request.user.id);

      return reply.code(200).send({
        code: 'get-sessions',
        data: sessions
      });
    }
  );

  fastify.delete(
    "/:id",
    {
      schema: routesSchema.revokeSession
    },
    async (
      request: FastifyRequest<{
        Params: RevokeSessionParamsType;
      }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;
      await sessionService.revoke(id, request.user.id);

      return reply.code(200).send({
        code: 'session-revoked'
      });
    }
  );
}