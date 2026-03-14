import { Elysia, Static, t } from 'elysia';
import { productPriceService } from "@/services";
import { CurrencySchema, PriceIntervalSchema, ProductPriceSchema } from "@/schemas/models/product.schema";
import { paginationSchema, metaSchema } from "@/schemas/pagination";


export const CreateProductPriceBodySchema = t.Object({
  productId: t.String(),
  amount: t.Numeric(),
  currencyCode: t.Union([CurrencySchema, t.String()]),
  active: t.Boolean({ default: true }),
  archived: t.Boolean({ default: false }),
  intervalType: PriceIntervalSchema,
  intervalValue: t.Numeric({ default: 1, minimum: 1, maximum: 1000 }),
});

export type CreateProductPriceType = typeof CreateProductPriceBodySchema.static;

export const UpdateProductPriceBodySchema = t.Object({
  amount: t.Optional(t.Numeric()),
  currencyCode: t.Optional(t.Union([CurrencySchema, t.String()])),
  active: t.Optional(t.Boolean()),
  archived: t.Optional(t.Boolean()),
  intervalType: t.Optional(PriceIntervalSchema),
  intervalValue: t.Optional(t.Numeric({ minimum: 1, maximum: 1000 })),
});

export type UpdateProductPriceType = typeof UpdateProductPriceBodySchema.static;

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
        body: CreateProductPriceBodySchema,
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
        body: UpdateProductPriceBodySchema,
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
