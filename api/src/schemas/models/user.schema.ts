import { t, Static } from "elysia";

export const UserSchema = t.Object({
  id: t.String(),
  email: t.String({ format: "email" }),
  name: t.String(),
  username: t.String(),
  provider: t.Union([t.String(), t.Null()]),
  image: t.Union([t.String(), t.Null()]),
  roleSlug: t.Union([t.String(), t.Null()]),
  emailVerified: t.Boolean(),
  preferences: t.Union([t.String(), t.Null()]),
  twoFactorEnabled: t.Union([t.Boolean(), t.Null()]),
  stripeCustomerId: t.Union([t.String(), t.Null()]),
  createdAt: t.Date(),
  updatedAt: t.Date(),
  displayUsername: t.Union([t.String(), t.Null()]),
});

export type UserType = Static<typeof UserSchema>;
