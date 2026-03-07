import { Elysia, t } from 'elysia';
import { couponService } from "@/services";
import { CouponSchema } from "@/schemas/models/coupon.schema";
import { paginationSchema } from "@/schemas/pagination";

export const adminCouponController = new Elysia({
    prefix: '/coupon',
    detail: { tags: ['Admin Coupons'] },
    
})
    .get('/', async ({ query }) => {
        const { data, meta } = await couponService.findAll(query);

        return {
            code: 'get-coupons',
            data,
            meta
        };
    }, {
        query: t.Intersect([paginationSchema])
    })
    .get('/:id', async ({ params: { id } }) => {
        const coupon = await couponService.findById(id);

        return {
            code: 'get-coupon',
            data: coupon,
        };
    }, {
        params: t.Object({ id: t.String() })
    })
    .post('/', async ({ body }) => {
        const coupon = await couponService.create(body);

        return {
            code: 'create-coupon',
            data: coupon,
        };
    }, {
        body: t.Omit(CouponSchema, ["id", "createdAt", "updatedAt"])
    })
    .put('/:id', async ({ params: { id }, body }) => {
        const coupon = await couponService.update(id, body);

        return {
            code: 'update-coupon',
            data: coupon,
        };
    }, {
        params: t.Object({ id: t.String() }),
        body: t.Partial(t.Omit(CouponSchema, ["id", "createdAt", "updatedAt"]))
    })
    .post('/:id/increment-usage', async ({ params: { id } }) => {
        const coupon = await couponService.incrementUsage(id);

        return {
            code: 'increment-usage',
            data: coupon,
        };
    }, {
        params: t.Object({ id: t.String() })
    });
