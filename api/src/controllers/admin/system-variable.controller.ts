import { Elysia, t } from 'elysia';
import { systemVariableService } from "@/services";
import { authMiddleware } from '@/middleware/auth.middleware';
import { metaSchema, paginationSchema } from '@/schemas/pagination';
import { SystemVariableSchema } from '@/schemas/models/system-variable.schema';


const GetSystemVariablesResponse = t.Object({
    code: t.String(),
    data: t.Array(SystemVariableSchema),
    meta: metaSchema
});

const GetSystemVariableResponse = t.Object({
    code: t.String(),
    data: SystemVariableSchema
});

const SetSystemVariableResponse = t.Object({
    code: t.String(),
    data: SystemVariableSchema
});

const SetSystemVariableBody = t.Object({
    id: t.String(),
    value: t.String()
});

export const adminSystemVariableController = new Elysia({
    prefix: '/system-variable',
    detail: { tags: ['Admin System Variables'] },
})
    .use(authMiddleware)
    .get('/', async ({ query }) => {
        const page = parseInt(String(query.page)) || 1;
        const perPage = parseInt(String(query.perPage)) || 10;
        const skip = (page - 1) * perPage;

        const { data, total } = await systemVariableService.findMany({
            skip,
            take: perPage
        });

        return {
            code: 'get-system-variables',
            data: data.map(v => ({
                ...v,
                createdAt: v.createdAt.toISOString(),
                updatedAt: v.updatedAt.toISOString()
            })),
            meta: {
                page,
                perPage,
                total
            }
        };
    }, {
        query: t.Intersect([paginationSchema]),
        response: GetSystemVariablesResponse
    })
    .get('/:id', async ({ params: { id } }) => {
        const systemVariable = await systemVariableService.findUnique(id);

        return {
            code: 'get-system-variable',
            data: {
                ...systemVariable,
                createdAt: systemVariable?.createdAt.toISOString(),
                updatedAt: systemVariable?.updatedAt.toISOString()
            }
        };
    }, {
        params: t.Object({ id: t.String() }),
        response: GetSystemVariableResponse
    })
    .post('/', async ({ body }) => {
        const { id, value } = body as { id: string; value: string };
        const result = await systemVariableService.set(id, value);

        return {
            code: 'set-system-variable',
            data: {
                ...result,
                createdAt: result.createdAt.toISOString(),
                updatedAt: result.updatedAt.toISOString()
            },
        };
    }, {
        body: SetSystemVariableBody,
        response: SetSystemVariableResponse
    })
    .put('/:id', async ({ params: { id }, body }) => {
        const { value } = body as { value: string };
        const result = await systemVariableService.set(id, value);

        return {
            code: 'update-system-variable',
            data: {
                ...result,
                createdAt: result.createdAt.toISOString(),
                updatedAt: result.updatedAt.toISOString()
            },
        };
    }, {
        params: t.Object({ id: t.String() }),
        body: t.Object({ value: t.String() }),
        response: SetSystemVariableResponse
    })
    .delete('/:id', async ({ params: { id } }) => {
        await systemVariableService.delete(id);

        return {
            code: 'delete-system-variable',
            data: { id }
        };
    }, {
        params: t.Object({ id: t.String() })
    });
