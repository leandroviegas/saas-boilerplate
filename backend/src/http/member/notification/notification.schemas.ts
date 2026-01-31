import { Static, Type } from "@sinclair/typebox";
import { NotificationSchema } from "@/schemas/models/notification.schema";
import { multiSchemaBuilder } from "@/schemas/schemas";
import { metaSchema, paginationSchema } from "@/schemas/pagination";

export const routesSchema = multiSchemaBuilder({
  getNotifications: {
    tags: ["Notifications"],
    querystring: Type.Intersect([
      paginationSchema
    ]),
    response: {
      200: {
        meta: metaSchema,
        data: Type.Array(NotificationSchema),
      }
    },
  },

  markAsRead: {
    tags: ["Notifications"],
    params: Type.Object({
      id: Type.String(),
    }),
    response: {
      200: {
        data: NotificationSchema,
      },
    },
  },

  markAllAsRead: {
    tags: ["Notifications"],
    response: {
      200: {
        message: Type.String(),
      },
    },
  },

  deleteNotification: {
    tags: ["Notifications"],
    params: Type.Object({
      id: Type.String(),
    }),
    response: {
      204: {},
    },
  },

  deleteAllNotifications: {
    tags: ["Notifications"],
    response: {
      204: {},
    },
  },
});

export type UpdateNotificationQueryType = Static<typeof routesSchema.getNotifications.querystring>;