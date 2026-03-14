import { t, Static } from "elysia";

export const SessionSchema = t.Object({
  id: t.String(),
  userId: t.String(),
  expiresAt: t.Date(),
  ipAddress: t.Optional(t.Union([t.String(), t.Null()])),
  userAgent: t.Optional(t.Union([t.String(), t.Null()])),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export type SessionType = Static<typeof SessionSchema>;
