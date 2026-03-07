import { t } from "elysia";

export const SessionSchema = t.Object({
  id: t.String(),
  userId: t.String(),
  expiresAt: t.String({ format: "date-time" }),
  ipAddress: t.Optional(t.String()),
  userAgent: t.Optional(t.String()),
  createdAt: t.String({ format: "date-time" }),
  updatedAt: t.String({ format: "date-time" }),
});
