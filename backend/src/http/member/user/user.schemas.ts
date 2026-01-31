import { UserSchema } from "@/schemas/models/user.schema";
import { multiSchemaBuilder } from "@/schemas/schemas";

export const routesSchema = multiSchemaBuilder({
  getCurrentUser: {
    tags: ["Users"],
    response: {
      200: {
        data: UserSchema,
      },
    }
  }
});