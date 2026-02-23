import { Type, Static } from "@sinclair/typebox";
import { SessionSchema } from "@/schemas/models/session.schema";
import { multiSchemaBuilder } from "@/schemas/schemas";

export const routesSchema = multiSchemaBuilder({
  getAllSessions: {
    tags: ["Sessions"],
    response: {
      200: {
        data: Type.Array(SessionSchema),
      }
    },
  },

  revokeSession: {
    tags: ["Sessions"],
    params: Type.Object({
      id: Type.String(),
    }),
    response: {
      200: {},
    },
  },
});

export type RevokeSessionParamsType = Static<typeof routesSchema.revokeSession.params>;