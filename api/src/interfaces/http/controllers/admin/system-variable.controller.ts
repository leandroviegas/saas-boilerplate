import { Elysia, t } from 'elysia';
import { systemVariableService } from "@/application";
import { authMiddleware } from '@/interfaces/http/middleware/auth.middleware';
import { metaSchema, paginationSchema } from '@/interfaces/http/schemas/pagination';
import { SystemVariableSchema } from '@/interfaces/http/schemas/models/system-variable.schema';


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
        const { data, meta } = await systemVariableService.findMany();

        return { code: 'get-system-variables', data, meta };
    }, {
        query: t.Intersect([paginationSchema]),
        response: GetSystemVariablesResponse
    })


    .get('/:id', async ({ params: { id } }) => {
        const data = await systemVariableService.findUnique(id);

        return { code: 'get-system-variable', data };
    }, {
        params: t.Object({ id: t.String() }),
        response: GetSystemVariableResponse
    })

    
    .post('/', async ({ body }) => {
        const { id, value } = body as { id: string; value: string };
        const data = await systemVariableService.set(id, value);

        return { code: 'set-system-variable', data };
    }, {
        body: SetSystemVariableBody,
        response: SetSystemVariableResponse
    })


    .put('/:id', async ({ params: { id }, body }) => {
        const { value } = body as { value: string };
        const data = await systemVariableService.set(id, value);

        return { code: 'update-system-variable', data };
    }, {
        params: t.Object({ id: t.String() }),
        body: t.Object({ value: t.String() }),
        response: SetSystemVariableResponse
    })

    
    .delete('/:id', async ({ params: { id } }) => {
        await systemVariableService.delete(id);

        return { code: 'delete-system-variable', data: { id } };
    }, {
        params: t.Object({ id: t.String() })
    });
