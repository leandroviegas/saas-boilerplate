import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { routesSchema } from "./user.schemas";

export async function userController(fastify: FastifyInstance) {
  fastify.get(
    "/me",
    {
      schema: routesSchema.getCurrentUser
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return reply.code(200).send({
        code: 'update-user',
        data: request.user
      });
    }
  );
}