import { Elysia, Static, t } from 'elysia';
import { paymentService, productService } from "@/services";
import { SubscriptionSchema } from "@/schemas/models/subscription.schema";
import { TransactionSchema } from "@/schemas/models/transaction.schema";
import { ProductSchema } from "@/schemas/models/product.schema";
import { paginationSchema, metaSchema } from "@/schemas/pagination";
import { authMiddleware } from "@/middleware/auth.middleware";
import { parsePermissions } from '@/middleware/permission.middleware';

const GetProductsResponse = t.Object({
    code: t.String(),
    data: t.Array(ProductSchema),
    meta: metaSchema
});

const CreateCheckoutResponse = t.Object({
    code: t.String(),
    data: t.Object({
        url: t.Union([t.String(), t.Null()])
    })
});

const GetSubscriptionResponse = t.Object({
    code: t.String(),
    data: SubscriptionSchema
});

const CancelSubscriptionResponse = t.Object({
    code: t.String(),
    message: t.String()
});

const GetTransactionsResponse = t.Object({
    code: t.String(),
    data: t.Array(TransactionSchema),
    meta: metaSchema
});

const CreateCheckoutSessionResponse = t.Object({
    productPriceId: t.String(),
    promotionCode: t.Optional(t.String()),
});

export type CreateCheckoutSessionResponseType = Static<typeof CreateCheckoutSessionResponse>;

export const memberPaymentController = new Elysia({
    prefix: '/payment',
    detail: { tags: ['Member Payment'] }
})
    .use(authMiddleware)
    .get('/products', async ({ query }) => {
        const { data, meta } = await productService.findAll(query);

        return {
            code: "get-products",
            data: data.map(p => ({ ...p, permissions: parsePermissions(p.permissions) })),
            meta
        };
    }, {
        query: t.Intersect([paginationSchema]),
        response: GetProductsResponse
    })
    .post('/checkout', async ({ body, user, session }) => {
        if (!user || !session) throw new Error("Unauthorized");
        const organizationId = session.activeOrganizationId;

        const checkoutSession = await paymentService.createCheckoutSession(user.id, organizationId, body);

        return {
            code: "create-checkout-session",
            data: { url: checkoutSession.url },
        };
    }, {
        body: CreateCheckoutSessionResponse,
        response: CreateCheckoutResponse
    })
    .get('/subscription', async ({ session }) => {
        if (!session) throw new Error("Unauthorized");
        const organizationId = session.activeOrganizationId;

        const subscription = await paymentService.getSubscription(organizationId);

        return {
            code: "get-subscription",
            data: {
                ...subscription,
                product: {
                    ...subscription.product,
                    permissions: parsePermissions(subscription.product.permissions)
                }
            },
        };
    }, {
        response: GetSubscriptionResponse
    })
    .post('/subscription/cancel', async ({ session }) => {
        if (!session) throw new Error("Unauthorized");
        const organizationId = session.activeOrganizationId;

        await paymentService.cancelSubscription(organizationId);

        return {
            code: "cancel-subscription",
            message: "Subscription canceled successfully",
        };
    }, {
        response: CancelSubscriptionResponse
    })
    .get('/transactions', async ({ query, user }) => {
        if (!user) throw new Error("Unauthorized");
        const { data, meta } = await paymentService.getTransactions(user.id, query);

        return {
            code: "get-transactions",
            data,
            meta
        };
    }, {
        query: t.Intersect([paginationSchema]),
        response: GetTransactionsResponse
    });
