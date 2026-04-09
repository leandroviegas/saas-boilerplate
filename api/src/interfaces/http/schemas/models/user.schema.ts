import { t, Static } from "elysia";

export const UserSchema = t.Object({
  id: t.String(),
  email: t.String({ format: "email" }),
  name: t.String(),
  username: t.String(),
  displayUsername: t.Nullable(t.String()),
  provider: t.Nullable(t.String()),
  image: t.Nullable(t.String()),
  roleSlug: t.Nullable(t.String()),
  emailVerified: t.Boolean(),
  preferences: t.Nullable(t.String()),
  twoFactorEnabled: t.Nullable(t.Boolean()),
  stripeCustomerId: t.Nullable(t.String()),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

export type UserType = Static<typeof UserSchema>;
