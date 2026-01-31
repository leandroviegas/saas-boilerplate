import { Type } from "@sinclair/typebox";

const sessionFieldsS = {
  id: Type.String(),
  userId: Type.String(),
  expiresAt: Type.String({ format: "date-time" }),
  ipAddress: Type.Optional(Type.String()),
  userAgent: Type.Optional(Type.String()),
  createdAt: Type.String({ format: "date-time" }),
  updatedAt: Type.String({ format: "date-time" }),
}

export const SessionSchema = Type.Object(sessionFieldsS);