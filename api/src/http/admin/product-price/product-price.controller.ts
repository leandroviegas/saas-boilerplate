import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { productPriceService } from "@/services";
import { routesSchema, CreateProductPriceBodyType, UpdateProductPriceBodyType, GetAllProductPricesQueryType } from "./product-price.schemas";

export async function productPriceController(fastify: FastifyInstance) {
  fastify.get(
    "/",
    {
      schema: routesSchema.getAllProductPrices
    },
    async (request: FastifyRequest<{ Querystring: GetAllProductPricesQueryType }>, reply: FastifyReply) => {
      const { data, meta } = await productPriceService.findAll(request.query);

      return reply.code(200).send({
        code: 'get-product-prices',
        data,
        meta
      });
    }
  );

  fastify.get(
    "/:id",
    {
      schema: routesSchema.getProductPriceById
    },
    async (
      request: FastifyRequest<{
        Params: { id: string; }
      }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;
      const data = await productPriceService.findById(id);

      return reply.code(200).send({
        code: 'get-product-price',
        data
      });
    }
  );

  fastify.post(
    "/",
    {
      schema: routesSchema.createProductPrice
    },
    async (
      request: FastifyRequest<{
        Body: CreateProductPriceBodyType;
      }>,
      reply: FastifyReply
    ) => {
      const data = await productPriceService.create(request.body);

      return reply.code(201).send({
        code: 'create-product-price',
        data
      });
    }
  );

  fastify.put(
    "/:id",
    {
      schema: routesSchema.updateProductPrice
    },
    async (
      request: FastifyRequest<{
        Params: { id: string; }
        Body: UpdateProductPriceBodyType;
      }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;
      const data = await productPriceService.update(id, request.body);

      return reply.code(200).send({
        code: 'update-product-price',
        data
      });
    }
  );

  fastify.delete(
    "/:id",
    {
      schema: routesSchema.deleteProductPrice
    },
    async (
      request: FastifyRequest<{
        Params: { id: string; }
      }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;
      const data = await productPriceService.delete(id);

      return reply.code(200).send({
        code: 'delete-product-price',
        data
      });
    }
  );

  fastify.patch(
    "/:id/switch-active",
    {
      schema: routesSchema.switchActiveProductPrice
    },
    async (
      request: FastifyRequest<{
        Params: { id: string; }
      }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;
      const data = await productPriceService.switchActive(id);

      return reply.code(200).send({
        code: 'switch-active-product-price',
        data
      });
    }
  );
}