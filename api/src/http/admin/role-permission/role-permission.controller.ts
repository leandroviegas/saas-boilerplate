import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { organizationRolePermissionService } from "@/services";
import { Prisma } from "@prisma/client";
import {
  routesSchema,
  CreateOrganizationRolePermissionsBodyType,
  UpdateOrganizationRolePermissionsBodyType,
} from "./role-permission.schemas";

export async function rolePermissionController(fastify: FastifyInstance) {
  fastify.get(
    "/",
    {
      schema: routesSchema.getAllOrganizationRolePermissions,
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const organizationId = request.session.activeOrganizationId;

      const data = await organizationRolePermissionService.findByOrganizationId(organizationId);

      return reply.code(200).send({
        code: "get-organization-role-permissions",
        data,
      });
    }
  );

  fastify.get(
    "/:roleSlug",
    {
      schema: routesSchema.getOrganizationRolePermissionsById,
    },
    async (
      request: FastifyRequest<{
        Params: { roleSlug: string };
      }>,
      reply: FastifyReply
    ) => {
      const organizationId = request.session.activeOrganizationId;
      const { roleSlug } = request.params;

      const data = await organizationRolePermissionService.findById(
        organizationId,
        roleSlug
      );

      return reply.code(200).send({
        code: "get-organization-role-permissions-by-id",
        data,
      });
    }
  );

  fastify.post(
    "/",
    {
      schema: routesSchema.createOrganizationRolePermissions,
    },
    async (
      request: FastifyRequest<{
        Body: CreateOrganizationRolePermissionsBodyType;
      }>,
      reply: FastifyReply
    ) => {
      const organizationId = request.session.activeOrganizationId;
      const { roleSlug, permissions } = request.body;
      
      const data = await organizationRolePermissionService.upsert(
        organizationId,
        roleSlug,
        permissions as Prisma.InputJsonValue
      );

      return reply.code(201).send({
        code: "create-organization-role-permissions",
        data,
      });
    }
  );

  fastify.put(
    "/:roleSlug",
    {
      schema: routesSchema.updateOrganizationRolePermissions,
    },
    async (
      request: FastifyRequest<{
        Params: { roleSlug: string };
        Body: UpdateOrganizationRolePermissionsBodyType;
      }>,
      reply: FastifyReply
    ) => {
      const organizationId = request.session.activeOrganizationId;
      const { roleSlug } = request.params;
      const { permissions } = request.body;

      const data = await organizationRolePermissionService.update(
        organizationId,
        roleSlug,
        { permissions: permissions as Prisma.InputJsonValue }
      );

      return reply.code(200).send({
        code: "update-organization-role-permissions",
        data,
      });
    }
  );

  fastify.delete(
    "/:roleSlug",
    {
      schema: routesSchema.deleteOrganizationRolePermissions,
    },
    async (
      request: FastifyRequest<{
        Params: { roleSlug: string };
      }>,
      reply: FastifyReply
    ) => {
      const organizationId = request.session.activeOrganizationId;
      const { roleSlug } = request.params;

      const data = await organizationRolePermissionService.delete(
        organizationId,
        roleSlug
      );

      return reply.code(200).send({
        code: "delete-organization-role-permissions",
        data,
      });
    }
  );
}
