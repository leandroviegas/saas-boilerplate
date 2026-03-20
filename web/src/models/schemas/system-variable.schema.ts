import { Type, Static } from "@sinclair/typebox";

// ============== System Variable Schemas ==============

export const SystemVariableSchema = Type.Object({
  id: Type.String(),
  value: Type.String(),
  createdAt: Type.String({ format: "date-time"}),
  updatedAt: Type.String({ format: "date-time"}),
});

export type SystemVariableType = Static<typeof SystemVariableSchema>;