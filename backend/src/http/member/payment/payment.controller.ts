import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { paymentService } from "@/services";
import { productService } from "@/services";
import { routesSchema, CreateCheckoutSessionBodyType, GetProductsQueryType, GetTransactionsQueryType } from "./payment.schemas";

export async function paymentController(fastify: FastifyInstance) {
  fastify.get(
    "/products",
    {
      schema: routesSchema.getProducts,
    },
    async (request: FastifyRequest<{ Querystring: GetProductsQueryType }>, reply: FastifyReply) => {
      const { data, meta } = await productService.findAll(request.query);

      return reply.code(200).send({
        code: "get-products",
        data,
        meta
      });
    }
  );

  fastify.post(
    "/checkout",
    {
      schema: routesSchema.createCheckoutSession,
    },
    async (
      request: FastifyRequest<{ Body: CreateCheckoutSessionBodyType }>,
      reply: FastifyReply
    ) => {
      const session = await paymentService.createCheckoutSession(request.user.id, request.member.organizationId, request.body);

      return reply.code(200).send({
        code: "create-checkout-session",
        data: { url: session.url },
      });
    }
  );

  fastify.get(
    "/subscription",
    {
      schema: routesSchema.getSubscription,
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const subscription = await paymentService.getSubscription(request.member.organizationId);

      return reply.code(200).send({
        code: "get-subscription",
        data: subscription,
      });
    }
  );

  fastify.post(
    "/subscription/cancel",
    {
      schema: routesSchema.cancelSubscription,
    },
    async (request: FastifyRequest, reply: FastifyReply) => { 
      await paymentService.cancelSubscription(request.member.organizationId);

      return reply.code(200).send({
        code: "cancel-subscription",
        message: "Subscription canceled successfully",
      });
    }
  );

  fastify.get(
    "/transactions",
    {
      schema: routesSchema.getTransactions,
    },
    async (request: FastifyRequest<{ Querystring: GetTransactionsQueryType }>, reply: FastifyReply) => {
      const { data, meta } = await paymentService.getTransactions(request.user.id, request.query);

      return reply.code(200).send({
        code: "get-transactions",
        data,
        meta
      });
    }
  );
}
