import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { productService } from "@/services";
import { routesSchema, CreateProductBodyType, UpdateProductBodyType, GetAllProductsQueryType } from "./product.schemas";

export async function productController(fastify: FastifyInstance) {
  fastify.get(
    "/",
    {
      schema: routesSchema.getAllProducts
    },
    async (request: FastifyRequest<{ Querystring: GetAllProductsQueryType }>, reply: FastifyReply) => {
      const { data, meta } = await productService.findAll(request.query);

      return reply.code(200).send({
        code: 'get-products',
        data,
        meta
      });
    }
  );

  fastify.get(
    "/:id",
    {
      schema: routesSchema.getProductById
    },
    async (
      request: FastifyRequest<{
        Params: { id: string; }
      }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;
      const data = await productService.findById(id);

      return reply.code(200).send({
        code: 'get-product',
        data
      });
    }
  );

  fastify.post(
    "/",
    {
      schema: routesSchema.createProduct
    },
    async (
      request: FastifyRequest<{
        Body: CreateProductBodyType;
      }>,
      reply: FastifyReply
    ) => {
      const data = await productService.create(request.body);

      return reply.code(201).send({
        code: 'create-product',
        data
      });
    }
  );

  fastify.put(
    "/:id",
    {
      schema: routesSchema.updateProduct
    },
    async (
      request: FastifyRequest<{
        Params: { id: string; }
        Body: UpdateProductBodyType;
      }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;
      const data = await productService.update(id, request.body);

      return reply.code(200).send({
        code: 'update-product',
        data
      });
    }
  );

  fastify.delete(
    "/:id",
    {
      schema: routesSchema.deleteProduct
    },
    async (
      request: FastifyRequest<{
        Params: { id: string; }
      }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;
      const data = await productService.delete(id);

      return reply.code(200).send({
        code: 'switch-active',
        data
      });
    }
  );

  fastify.patch(
    "/:id/switch-active",
    {
      schema: routesSchema.switchActiveProduct
    },
    async (
      request: FastifyRequest<{
        Params: { id: string; }
      }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;
      const data = await productService.switchActive(id);

      return reply.code(200).send({
        code: 'switch-active',
        data
      });
    }
  );

}
