import { Type, Static } from "@sinclair/typebox";
import { UserSchema } from "@/schemas/models/user.schema";
import { multiSchemaBuilder } from "@/schemas/schemas";
import { paginationSchema, metaSchema } from "@/schemas/pagination";


export const routesSchema = multiSchemaBuilder({
  updateUser: {
    tags: ["Users"],
    params: Type.Object({
      id: Type.String(),
    }),
    body: Type.Pick(UserSchema, ["email", "name", "image", "username", "preferences"]),
    response: {
      200: {
        data: UserSchema
      },
    },
  },


  getAllUsers: {
    tags: ["Users"],
    querystring: Type.Intersect([
      paginationSchema
    ]),
    response: {
      200: {
        data: Type.Array(UserSchema),
        meta: metaSchema
      }
    },
  },


  getUserById: {
    tags: ["Users"],
    params: Type.Object({
      id: Type.String(),
    }),
    response: {
      200: {
        data: UserSchema,
      },
    }
  },


  deleteUser: {
    tags: ["Users"],
    params: Type.Object({
      id: Type.String(),
    }),
    response: {
      204: {}
    }
  },
});

export type UpdateUserBodyType = Static<typeof routesSchema.updateUser.body>;
export type GetAllUsersQueryType = Static<typeof routesSchema.getAllUsers.querystring>;
