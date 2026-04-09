import { t, Static } from "elysia";

export const NotificationSchema = t.Object({
  id: t.String(),
  userId: t.String(),
  title: t.String(),
  message: t.String(),
  type: t.String(),
  link: t.MaybeEmpty(t.String()),
  read: t.Boolean(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export type NotificationType = Static<typeof NotificationSchema>;
