import { Elysia, t } from 'elysia';
import { paymentService } from "@/application";

export const webhookController = new Elysia({
    prefix: '/webhook',
    detail: { tags: ['Webhook'] }
})
    .post('/stripe', async ({ request, headers, set }) => {
        const signature = headers["stripe-signature"];
        const payload = await request.text();

        if (!signature) {
            set.status = 400;
            return { code: "invalid-payload" };
        }

        await paymentService.handleWebhook(payload, signature);
        return { received: true, code: "received-successfully" };
    }, {
        body: t.Any()
    });
