import { Elysia, t } from 'elysia';
import { productPriceService } from "@/services";
import { ProductPriceSchema, ProductPriceType, CreateProductPriceType, UpdateProductPriceType } from "@/schemas/models/product.schema";
import { paginationSchema, metaSchema } from "@/schemas/pagination";
import { authMiddleware } from '@/middleware/auth.middleware';

export type { ProductPriceType, CreateProductPriceType, UpdateProductPriceType };


const GetProductPricesResponse = t.Object({
    code: t.String(),
    data: t.Array(ProductPriceSchema),
    meta: metaSchema
});

const GetProductPriceResponse = t.Object({
    code: t.String(),
    data: ProductPriceSchema
});

const CreateProductPriceResponse = t.Object({
    code: t.String(),
    data: ProductPriceSchema
});

const UpdateProductPriceResponse = t.Object({
    code: t.String(),
    data: ProductPriceSchema
});

const DeleteProductPriceResponse = t.Object({
    code: t.String(),
    data: ProductPriceSchema
});

const SwitchActiveResponse = t.Object({
    code: t.String(),
    data: ProductPriceSchema
});

export const adminProductPriceController = new Elysia({
    prefix: '/product-price',
    detail: { tags: ['Admin Product Prices'] }
})
    .use(authMiddleware)


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
        ]),
        response: GetProductPricesResponse
    })


    .get('/:id', async ({ params: { id } }) => {
        const data = await productPriceService.findById(id);

        return {
            code: 'get-product-price',
            data
        };
    }, {
        params: t.Object({ id: t.String() }),
        response: GetProductPriceResponse
    })


    .post('/', async ({ body }) => {
        const data = await productPriceService.create(body);

        return {
            code: 'create-product-price',
            data
        };
    }, {
        body: t.Omit(ProductPriceSchema, ['id', 'stripePriceId', 'createdAt', 'updatedAt']),
        response: CreateProductPriceResponse
    })

    
    .put('/:id', async ({ params: { id }, body }) => {
        const data = await productPriceService.update(id, body);

        return {
            code: 'update-product-price',
            data
        };
    }, {
        params: t.Object({ id: t.String() }),
        body: t.Omit(ProductPriceSchema, ['stripePriceId', 'createdAt', 'updatedAt']),
        response: UpdateProductPriceResponse
    })


    .delete('/:id', async ({ params: { id } }) => {
        const data = await productPriceService.delete(id);

        return {
            code: 'delete-product-price',
            data
        };
    }, {
        params: t.Object({ id: t.String() }),
        response: DeleteProductPriceResponse
    })

    
    .patch('/:id/switch-active', async ({ params: { id } }) => {
        const data = await productPriceService.switchActive(id);

        return {
            code: 'switch-active-product-price',
            data
        };
    }, {
        params: t.Object({ id: t.String() }),
        response: SwitchActiveResponse
    });
