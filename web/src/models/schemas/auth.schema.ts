import { Type, Static } from "@sinclair/typebox";

// ============== Auth Schemas ==============

export const SignInSchema = Type.Object({
  email: Type.String({ format: "email" }),
  password: Type.String(),
});

export type SignInType = Static<typeof SignInSchema>;

export const SignUpSchema = Type.Object({
  name: Type.String({ minLength: 1 }),
  lastName: Type.String({ minLength: 1 }),
  email: Type.String({ format: "email" }),
  username: Type.Optional(Type.String()),
  password: Type.String({ minLength: 8 }),
  confirmPassword: Type.String({ minLength: 1 }),
});

export type SignUpType = Static<typeof SignUpSchema>;

export const VerifySchema = Type.Object({
  otpCode: Type.String({ minLength: 6, maxLength: 6 }),
});

export type VerifyType = Static<typeof VerifySchema>;