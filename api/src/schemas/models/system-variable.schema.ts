import { t } from "elysia";

export const SystemVariableSchema = t.Object({
    id: t.String(),
    value: t.String(),
    createdAt: t.String(),
    updatedAt: t.String()
});