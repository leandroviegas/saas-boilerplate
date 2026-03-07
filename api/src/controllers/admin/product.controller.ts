import { Elysia, t } from 'elysia';
import { productService } from "@/services";
import { ProductSchema } from "@/schemas/models/product.schema";
import { paginationSchema } from "@/schemas/pagination";

export const adminProductController = new Elysia({
    prefix: '/product',
    detail: { tags: ['Admin Products'] }
})
    .get('/', async ({ query }) => {
        const { data, meta } = await productService.findAll(query);

        return {
            code: 'get-products',
            data,
            meta
        };
    }, {
        query: t.Intersect([paginationSchema])
    })
    .get('/:id', async ({ params: { id } }) => {
        const data = await productService.findById(id);

        return {
            code: 'get-product',
            data
        };
    }, {
        params: t.Object({ id: t.String() })
    })
    .post('/', async ({ body }) => {
        const data = await productService.create(body);

        return {
            code: 'create-product',
            data
        };
    }, {
        body: t.Omit(ProductSchema, ["id", "createdAt", "updatedAt"])
    })
    .put('/:id', async ({ params: { id }, body }) => {
        const data = await productService.update(id, body);

        return {
            code: 'update-product',
            data
        };
    }, {
        params: t.Object({ id: t.String() }),
        body: t.Omit(ProductSchema, ["createdAt", "updatedAt"])
    })
    .delete('/:id', async ({ params: { id } }) => {
        const data = await productService.delete(id);

        return {
            code: 'switch-active',
            data
        };
    }, {
        params: t.Object({ id: t.String() })
    })
    .patch('/:id/switch-active', async ({ params: { id } }) => {
        const data = await productService.switchActive(id);

        return {
            code: 'switch-active',
            data
        };
    }, {
        params: t.Object({ id: t.String() })
    });
