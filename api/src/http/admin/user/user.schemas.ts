import { t } from "elysia";

export const UpdateUserBodySchema = t.Object({
  email: t.String({ format: "email" }),
  name: t.String(),
  username: t.String(),
  image: t.Optional(t.String()),
  preferences: t.Optional(t.String()),
});

export type UpdateUserBodyType = typeof UpdateUserBodySchema.static;
