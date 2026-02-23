import { Type } from "@sinclair/typebox";

const notificationFieldsS = {
  id: Type.String(),
  userId: Type.String(),
  title: Type.String(),
  message: Type.String(),
  type: Type.String(), // 'info', 'success', 'warning', 'error'
  link: Type.Optional(Type.String()),
  read: Type.Boolean({ default: false }),
  createdAt: Type.String({ format: "date-time" }),
  updatedAt: Type.String({ format: "date-time" }),
}

export const NotificationSchema = Type.Object(notificationFieldsS);
