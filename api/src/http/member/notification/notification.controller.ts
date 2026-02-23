import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { notificationService } from "@/services";
import { routesSchema, UpdateNotificationQueryType } from "./notification.schemas";

export async function notificationController(fastify: FastifyInstance) {
  fastify.get(
    "/",
    {
      schema: routesSchema.getNotifications
    },
    async (request: FastifyRequest<{ Querystring: UpdateNotificationQueryType }>, reply: FastifyReply) => {
      const { data, meta } = await notificationService.findAllByUserId(request.user.id, request.query);

      return reply.code(200).send({
        code: 'get-notifications',
        data,
        meta
      });
    }
  );

  fastify.put(
    "/:id/read",
    {
      schema: routesSchema.markAsRead
    },
    async (
      request: FastifyRequest<{
        Params: { id: string; }
      }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;
      const data = await notificationService.markAsRead(id, request.user.id);

      return reply.code(200).send({
        code: 'mark-notification-read',
        data
      });
    }
  );

  fastify.put(
    "/read-all",
    {
      schema: routesSchema.markAllAsRead
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      await notificationService.markAllAsRead(request.user.id);

      return reply.code(200).send({
        code: 'mark-all-notifications-read'
      });
    }
  );

  fastify.delete(
    "/:id",
    {
      schema: routesSchema.deleteNotification
    },
    async (
      request: FastifyRequest<{
        Params: { id: string; }
      }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;
      await notificationService.delete(id, request.user.id);

      return reply.code(204).send();
    }
  );

  fastify.delete(
    "/",
    {
      schema: routesSchema.deleteAllNotifications
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      await notificationService.deleteAll(request.user.id);

      return reply.code(204).send();
    }
  );
}
