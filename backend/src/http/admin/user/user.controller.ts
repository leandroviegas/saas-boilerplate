import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { userService } from "@/services";
import { routesSchema, UpdateUserBodyType, GetAllUsersQueryType } from "./user.schemas";

export async function userController(fastify: FastifyInstance) {
  fastify.get(
    "/",
    {
      schema: routesSchema.getAllUsers
    },
    async (request: FastifyRequest<{ Querystring: GetAllUsersQueryType }>, reply: FastifyReply) => {
      const { data, meta } = await userService.findAll(request.query);

      return reply.code(200).send({
        code: 'get-users',
        data,
        meta
      });
    }
  );

  fastify.get(
    "/:id",
    {
      schema: routesSchema.getUserById
    },
    async (
      request: FastifyRequest<{
        Params: { id: string; }
      }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;
      const user = await userService.findById(id);

      return reply.code(200).send({ code: 'update-user', data: user });
    }
  );

  fastify.put(
    "/:id",
    {
      schema: routesSchema.updateUser
    },
    async (
      request: FastifyRequest<{
        Params: { id: string; }
        Body: UpdateUserBodyType;
      }>,
      reply: FastifyReply
    ) => {
      const { id } = request.user;
      const data = await userService.update(id, request.body);

      return reply.code(200).send({
        code: 'update-user',
        data
      });
    }
  );

  fastify.delete(
    "/:id",
    {
      schema: routesSchema.deleteUser
    },
    async (
      request: FastifyRequest<{
        Params: { id: string; }
      }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;
      await userService.delete(id);

      return reply.code(204).send();
    }
  );
}