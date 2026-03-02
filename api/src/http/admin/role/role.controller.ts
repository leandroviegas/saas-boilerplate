import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { roleService } from "@/services";
import { routesSchema, CreateRoleBodyType, UpdateRoleBodyType } from "./role.schemas";

export async function roleController(fastify: FastifyInstance) {
  fastify.get(
    "/",
    {
      schema: routesSchema.getAllRoles
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const data = await roleService.findAll();

      return reply.code(200).send({
        code: 'get-roles',
        data
      });
    }
  );

  fastify.get(
    "/:slug",
    {
      schema: routesSchema.getRoleBySlug
    },
    async (
      request: FastifyRequest<{
        Params: { slug: string; }
      }>,
      reply: FastifyReply
    ) => {
      const { slug } = request.params;
      const data = await roleService.findById(slug);

      return reply.code(200).send({
        code: 'get-role',
        data
      });
    }
  );

  fastify.post(
    "/",
    {
      schema: routesSchema.createRole
    },
    async (
      request: FastifyRequest<{
        Body: CreateRoleBodyType;
      }>,
      reply: FastifyReply
    ) => {
      const data = await roleService.create(request.body);

      return reply.code(201).send({
        code: 'create-role',
        data
      });
    }
  );

  fastify.put(
    "/:slug",
    {
      schema: routesSchema.updateRole
    },
    async (
      request: FastifyRequest<{
        Params: { slug: string; }
        Body: UpdateRoleBodyType;
      }>,
      reply: FastifyReply
    ) => {
      const { slug } = request.params;
      const data = await roleService.update(slug, request.body);

      return reply.code(200).send({
        code: 'update-role',
        data
      });
    }
  );

  fastify.delete(
    "/:slug",
    {
      schema: routesSchema.deleteRole
    },
    async (
      request: FastifyRequest<{
        Params: { slug: string; }
      }>,
      reply: FastifyReply
    ) => {
      const { slug } = request.params;
      const data = await roleService.delete(slug);

      return reply.code(200).send({
        code: 'delete-role',
        data
      });
    }
  );
}
