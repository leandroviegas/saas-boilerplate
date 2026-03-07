import { t } from "elysia";

export const UserSchema = t.Object({
  id: t.String(),
  email: t.String({ format: "email" }),
  name: t.String(),
  username: t.String(),
  provider: t.Optional(t.String()),
  image: t.Optional(t.String()),
  role: t.String({ default: "USER" }),
  emailVerified: t.Boolean({ default: false }),
  preferences: t.Optional(t.String()),
  twoFactorEnabled: t.Optional(t.Boolean()),
  createdAt: t.String({ format: "date-time" }),
  updatedAt: t.String({ format: "date-time" }),
});
