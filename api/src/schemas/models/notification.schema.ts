import { t } from "elysia";

export const NotificationSchema = t.Object({
  id: t.String(),
  userId: t.String(),
  title: t.String(),
  message: t.String(),
  type: t.String(), // 'info', 'success', 'warning', 'error'
  link: t.Optional(t.String()),
  read: t.Boolean({ default: false }),
  createdAt: t.String({ format: "date-time" }),
  updatedAt: t.String({ format: "date-time" }),
});
