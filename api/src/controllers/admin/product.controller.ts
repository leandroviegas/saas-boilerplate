import { Elysia, Static, t } from 'elysia';
import { productService } from "@/services";
import { ProductSchema, ProductPriceSchema } from "@/schemas/models/product.schema";
import { paginationSchema, metaSchema } from "@/schemas/pagination";
import { parsePermissions } from '@/middleware/permission.middleware';
import { authMiddleware } from '@/middleware/auth.middleware';

const ProductWithPricesSchema = t.Object({
    prices: t.Optional(t.Array(ProductPriceSchema))
});

const GetProductsResponse = t.Object({
    code: t.String(),
    data: t.Array(t.Intersect([ProductSchema, ProductWithPricesSchema])),
    meta: metaSchema
});

const GetProductResponse = t.Object({
    code: t.String(),
    data: t.Intersect([ProductSchema, ProductWithPricesSchema])
});

const CreateProductResponse = t.Object({
    code: t.String(),
    data: ProductSchema
});

const UpdateProductResponse = t.Object({
    code: t.String(),
    data: ProductSchema
});

const DeleteProductResponse = t.Object({
    code: t.String(),
    data: ProductSchema
});

const SwitchActiveResponse = t.Object({
    code: t.String(),
    data: ProductSchema
});

export const adminProductController = new Elysia({
    prefix: '/product',
    detail: { tags: ['Admin Products'] }
})
    .use(authMiddleware)
    .get('/', async ({ query }) => {
        const { data, meta } = await productService.findAll(query);

        return {
            code: 'get-products',
            data: data.map(p => ({ ...p, permissions: parsePermissions(p.permissions) })),
            meta
        };
    }, {
        query: t.Intersect([paginationSchema]),
        response: GetProductsResponse
    })
    .get('/:id', async ({ params: { id } }): Promise<Static<typeof GetProductResponse>> => {
        const data = await productService.findById(id);

        return {
            code: 'get-product',
            data: { ...data, permissions: parsePermissions(data.permissions) }
        };
    }, {
        params: t.Object({ id: t.String() }),
        response: GetProductResponse
    })
    .post('/', async ({ body }) => {
        const data = await productService.create(body);

        return {
            code: 'create-product',
            data: { ...data, permissions: parsePermissions(data.permissions) }
        };
    }, {
        body: t.Omit(ProductSchema, ["id", "archived", "active", "createdAt", "updatedAt"]),
        response: CreateProductResponse
    })
    .put('/:id', async ({ params: { id }, body }) => {
        const data = await productService.update(id, body);

        return {
            code: 'update-product',
            data: { ...data, permissions: parsePermissions(data.permissions) }
        };
    }, {
        params: t.Object({ id: t.String() }),
        body: t.Omit(ProductSchema, ["archived", "active", "createdAt", "updatedAt"]),
        response: UpdateProductResponse
    })
    .delete('/:id', async ({ params: { id } }) => {
        const data = await productService.delete(id);

        return {
            code: 'switch-active',
            data: { ...data, permissions: parsePermissions(data.permissions) }
        };
    }, {
        params: t.Object({ id: t.String() }),
        response: DeleteProductResponse
    })
    .patch('/:id/switch-active', async ({ params: { id } }) => {
        const data = await productService.switchActive(id);

        return {
            code: 'switch-active',
            data: { ...data, permissions: parsePermissions(data.permissions) }
        };
    }, {
        params: t.Object({ id: t.String() }),
        response: SwitchActiveResponse
    });
