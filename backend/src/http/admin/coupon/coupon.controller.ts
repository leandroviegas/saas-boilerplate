import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { couponService } from "@/services";
import { routesSchema, CreateCouponBodyType, UpdateCouponBodyType, GetAllCouponsQueryType } from "./coupon.schemas";

export async function couponController(fastify: FastifyInstance) {
  fastify.get(
    "/",
    {
      schema: routesSchema.getAllCoupons
    },
    async (request: FastifyRequest<{ Querystring: GetAllCouponsQueryType }>, reply: FastifyReply) => {
      const { data, meta } = await couponService.findAll(request.query);

      return reply.code(200).send({
        code: 'get-coupons',
        data,
        meta
      });
    }
  );

  fastify.get(
    "/:id",
    {
      schema: routesSchema.getCouponById
    },
    async (
      request: FastifyRequest<{
        Params: { id: string; }
      }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;
      const coupon = await couponService.findById(id);

      return reply.code(200).send({
        code: 'get-coupon',
        data: coupon,
      });
    }
  );

  fastify.post(
    "/",
    {
      schema: routesSchema.createCoupon
    },
    async (
      request: FastifyRequest<{
        Body: CreateCouponBodyType;
      }>,
      reply: FastifyReply
    ) => {
      const coupon = await couponService.create(request.body);

      return reply.code(201).send({
        code: 'create-coupon',
        data: coupon,
      });
    }
  );

  fastify.put(
    "/:id",
    {
      schema: routesSchema.updateCoupon
    },
    async (
      request: FastifyRequest<{
        Params: { id: string; }
        Body: UpdateCouponBodyType;
      }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;
      const coupon = await couponService.update(id, request.body);

      return reply.code(200).send({
        code: 'update-coupon',
        data: coupon,
      });
    }
  );

  fastify.post(
    "/:id/increment-usage",
    {
      schema: routesSchema.incrementUsage
    },
    async (
      request: FastifyRequest<{
        Params: { id: string; }
      }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;
      const coupon = await couponService.incrementUsage(id);

      return reply.code(200).send({
        code: 'increment-usage',
        data: coupon,
      });
    }
  );
}