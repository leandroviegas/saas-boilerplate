import { Type, TSchema } from "@sinclair/typebox";

const respSchemas = {
  error: Type.Object({
    code: Type.String({ default: 'OPERATION_ERROR' }),
    message: Type.String({ default: 'Unexpected error' }),
    validations: Type.Optional(
      Type.Array(
        Type.Object({
          field: Type.String(),
          message: Type.String()
        })
      )
    )
  }),
  success: Type.Object({
    code: Type.String({ default: 'OPERATION_SUCCESS' }),
    message: Type.String({ default: 'Operation completed successfully' }),
  })
};

export function response2xx<T extends Record<string, TSchema> | TSchema>(
  schema: T
) {
  const normalizedSchema =
    typeof (schema as any)[Symbol.for("TypeBox.Kind")] === "string"
      ? (schema as TSchema)
      : Type.Object(schema as Record<string, TSchema>);

  return Type.Intersect([
    respSchemas.success,
    normalizedSchema,
  ]);
}

export const ErrorResponses = {
  400: { description: 'Bad Request', content: { 'application/json': { schema: respSchemas.error } } },
} as const

export interface RouteSchema {
  summary?: string
  description?: string
  tags?: string[]
  body?: TSchema
  params?: TSchema
  querystring?: TSchema
  headers?: TSchema
  response?: Record<number, TSchema | any>
}

export function schemaBuilder<S extends RouteSchema>(schema: S): S & { response: NonNullable<S['response']> } {
  return {
    ...schema,
    response: {
      ...ErrorResponses,
      ...(schema.response ?? {}),
    },
  }
}

export function multiSchemaBuilder<T extends Record<string, RouteSchema>>(schemas: T) {
  const result: any = {};

  for (const [key, schema] of Object.entries(schemas)) {
    const transformedResponse: Record<number, TSchema> = {};

    if (schema.response) {
      for (const [statusCode, responseSchema] of Object.entries(schema.response)) {
        const code = Number(statusCode);
        if (code >= 200 && code < 300) {
          transformedResponse[code] = response2xx(responseSchema);
        } else {
          transformedResponse[code] = responseSchema;
        }
      }
    }

    result[key] = schemaBuilder({
      ...schema,
      response: transformedResponse,
    });
  }

  return result as {
    [K in keyof T]: T[K] & { response: NonNullable<T[K]['response']> }
  };
}