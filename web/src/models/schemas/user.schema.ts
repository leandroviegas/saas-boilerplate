import { Type, Static } from "@sinclair/typebox";

// ============== User Schemas ==============

// Base user schema (for reference)
const UserBaseSchema = Type.Object({
  id: Type.String(),
  email: Type.String({ format: "email" }),
  name: Type.String(),
  username: Type.String(),
  image: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  roleSlug: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  emailVerified: Type.Boolean(),
  preferences: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  twoFactorEnabled: Type.Optional(Type.Union([Type.Boolean(), Type.Null()])),
  stripeCustomerId: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  createdAt: Type.Date(),
  updatedAt: Type.Date(),
  displayUsername: Type.Optional(Type.Union([Type.String(), Type.Null()])),
});

// Use Pick to select fields for user details form
export const UserDetailsSchema = Type.Pick(UserBaseSchema, [
  "name",
  "username",
  "email",
  "image",
]);

export type UserDetailsType = Static<typeof UserDetailsSchema>;

// Password change schema
export const PasswordSchema = Type.Object({
  currentPassword: Type.String({ minLength: 1 }),
  newPassword: Type.String({ minLength: 8 }),
  confirmPassword: Type.String({ minLength: 1 }),
});

export type PasswordType = Static<typeof PasswordSchema>;

// TwoFactor password schema (for enable/disable)
export const TwoFactorPasswordSchema = Type.Object({
  password: Type.String({ minLength: 1 }),
});

export type TwoFactorPasswordType = Static<typeof TwoFactorPasswordSchema>;

// TwoFactor verify schema
export const TwoFactorVerifySchema = Type.Object({
  otpCode: Type.String({ minLength: 6, maxLength: 6 }),
});

export type TwoFactorVerifyType = Static<typeof TwoFactorVerifySchema>;