import { Type } from "@sinclair/typebox";

const userFieldsS = {
  id: Type.String(),
  email: Type.String({ format: "email" }),
  name: Type.String(),
  username: Type.String(),
  provider: Type.Optional(Type.String()),
  image: Type.Optional(Type.String()),
  role: Type.String({ default: "USER" }),
  emailVerified: Type.Boolean({ default: false }),
  preferences: Type.Optional(Type.String()),
  twoFactorEnabled: Type.Optional(Type.Boolean()),
  createdAt: Type.String({ format: "date-time" }),
  updatedAt: Type.String({ format: "date-time" }),
}

export const UserSchema = Type.Object(userFieldsS);