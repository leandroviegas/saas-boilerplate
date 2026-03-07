import { Elysia, t } from 'elysia';
import { productPriceService } from "@/services";
import { ProductPriceSchema } from "@/schemas/models/product.schema";
import { paginationSchema } from "@/schemas/pagination";

export const adminProductPriceController = new Elysia({
    prefix: '/product-price',
    detail: { tags: ['Admin Product Prices'] }
})
    .get('/', async ({ query }) => {
        const { data, meta } = await productPriceService.findAll(query);

        return {
            code: 'get-product-prices',
            data,
            meta
        };
    }, {
        query: t.Intersect([
            paginationSchema,
            t.Object({
                productId: t.Optional(t.String()),
            }),
        ])
    })
    .get('/:id', async ({ params: { id } }) => {
        const data = await productPriceService.findById(id);

        return {
            code: 'get-product-price',
            data
        };
    }, {
        params: t.Object({ id: t.String() })
    })
    .post('/', async ({ body }) => {
        const data = await productPriceService.create(body);

        return {
            code: 'create-product-price',
            data
        };
    }, {
        body: t.Intersect([
            t.Omit(ProductPriceSchema, ["id", "createdAt", "updatedAt", "stripePriceId"]),
            t.Object({ productId: t.String() })
        ])
    })
    .put('/:id', async ({ params: { id }, body }) => {
        const data = await productPriceService.update(id, body);

        return {
            code: 'update-product-price',
            data
        };
    }, {
        params: t.Object({ id: t.String() }),
        body: t.Omit(ProductPriceSchema, ["createdAt", "updatedAt", "stripePriceId"])
    })
    .delete('/:id', async ({ params: { id } }) => {
        const data = await productPriceService.delete(id);

        return {
            code: 'delete-product-price',
            data
        };
    }, {
        params: t.Object({ id: t.String() })
    })
    .patch('/:id/switch-active', async ({ params: { id } }) => {
        const data = await productPriceService.switchActive(id);

        return {
            code: 'switch-active-product-price',
            data
        };
    }, {
        params: t.Object({ id: t.String() })
    });
