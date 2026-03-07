import { Elysia, t } from 'elysia';
import { paymentService, productService } from "@/services";
import { paginationSchema } from "@/schemas/pagination";
import { authMiddleware } from "@/middleware/auth.middleware";

export const memberPaymentController = new Elysia({
    prefix: '/payment',
    detail: { tags: ['Member Payment'] }
})
    .use(authMiddleware)
    .get('/products', async ({ query }) => {
        const { data, meta } = await productService.findAll(query);

        return {
            code: "get-products",
            data,
            meta
        };
    }, {
        query: t.Intersect([paginationSchema])
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
        body: t.Object({
            productPriceId: t.String(),
            promotionCode: t.Optional(t.String()),
        })
    })
    .get('/subscription', async ({ session }) => {
        if (!session) throw new Error("Unauthorized");
        const organizationId = session.activeOrganizationId;

        const subscription = await paymentService.getSubscription(organizationId);

        return {
            code: "get-subscription",
            data: subscription,
        };
    }, {
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
        query: t.Intersect([paginationSchema])
    });
