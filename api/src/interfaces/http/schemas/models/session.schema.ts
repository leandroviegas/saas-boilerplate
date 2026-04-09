import { t, Static } from "elysia";

export const SessionSchema = t.Object({
  id: t.String(),
  userId: t.String(),
  expiresAt: t.Date(),
  ipAddress: t.MaybeEmpty(t.String()),
  userAgent: t.MaybeEmpty(t.String()),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export type SessionType = Static<typeof SessionSchema>;
