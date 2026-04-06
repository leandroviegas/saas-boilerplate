import { t } from "elysia";

export const errorSchema = t.Object({
    code: t.String({ default: 'VALIDATION_ERROR' }),
    message: t.String({ default: 'Validation error' }),
    validations: t.Optional(
        t.Array(
            t.Object({
                field: t.String(),
                message: t.String()
            })
        )
    )
});

export const successSchema = t.Object({
    code: t.String({ default: 'OPERATION_SUCCESS' }),
    message: t.String({ default: 'Operation completed successfully' }),
});
