import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { paymentService } from "@/services";

export async function webhookController(fastify: FastifyInstance) {
  fastify.post(
    "/stripe",
    { 
      config: {
        rawBody: true,
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const signature = request.headers["stripe-signature"] as string;
      const payload = request.rawBody;

      if (typeof payload !== 'string') {
        return reply.code(400).send({ code: "invalid-payload" });
      }

      await paymentService.handleWebhook(payload, signature);
      return reply.code(200).send({ received: true, code: "received-successfully" });
    }
  );
}
