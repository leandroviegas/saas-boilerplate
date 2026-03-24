import { Elysia, t } from 'elysia';
import { couponService } from "@/services";
import { CouponSchema } from "@/schemas/models/coupon.schema";
import { paginationSchema, metaSchema } from "@/schemas/pagination";
import { authMiddleware } from '@/middleware/auth.middleware';

const GetCouponsResponse = t.Object({
    code: t.String(),
    data: t.Array(CouponSchema),
    meta: metaSchema
});

const GetCouponResponse = t.Object({
    code: t.String(),
    data: CouponSchema
});

const CreateCouponResponse = t.Object({
    code: t.String(),
    data: CouponSchema
});

const UpdateCouponResponse = t.Object({
    code: t.String(),
    data: CouponSchema
});

const DeleteCouponResponse = t.Object({
    code: t.String(),
    data: CouponSchema
});

const IncrementUsageResponse = t.Object({
    code: t.String(),
    data: CouponSchema
});

export const adminCouponController = new Elysia({
    prefix: '/coupon',
    detail: { tags: ['Admin Coupons'] },

})
    .use(authMiddleware)
    .get('/', async ({ query }) => {
        const { data, meta } = await couponService.findAll(query);

        return {
            code: 'get-coupons',
            data,
            meta
        };
    }, {
        query: t.Intersect([paginationSchema]),
        response: GetCouponsResponse
    })


    .get('/:id', async ({ params: { id } }) => {
        const coupon = await couponService.findById(id);

        return {
            code: 'get-coupon',
            data: coupon,
        };
    }, {
        params: t.Object({ id: t.String() }),
        response: GetCouponResponse
    })


    .post('/', async ({ body }) => {
        const coupon = await couponService.create(body);

        return {
            code: 'create-coupon',
            data: coupon,
        };
    }, {
        body: t.Omit(CouponSchema, ["id", "createdAt", "updatedAt"]),
        response: CreateCouponResponse
    })


    .put('/:id', async ({ params: { id }, body }) => {
        const coupon = await couponService.update(id, body);

        return {
            code: 'update-coupon',
            data: coupon,
        };
    }, {
        params: t.Object({ id: t.String() }),
        body: t.Partial(t.Omit(CouponSchema, ["id", "createdAt", "updatedAt"])),
        response: UpdateCouponResponse
    })

    
    .post('/:id/increment-usage', async ({ params: { id } }) => {
        const coupon = await couponService.incrementUsage(id);

        return {
            code: 'increment-usage',
            data: coupon,
        };
    }, {
        params: t.Object({ id: t.String() }),
        response: IncrementUsageResponse
    })


    .delete('/:id', async ({ params: { id } }) => {
        const coupon = await couponService.delete(id);

        return {
            code: 'delete-coupon',
            data: coupon,
        };
    }, {
        params: t.Object({ id: t.String() }),
        response: DeleteCouponResponse
    });
