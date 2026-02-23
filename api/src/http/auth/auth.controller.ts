import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { auth } from "@/auth";

export async function authController(fastify: FastifyInstance) {
  fastify.all("/*", {
    schema: {
      hide: true
    }
  },async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const url = new URL(request.url, `${request.protocol}://${request.headers.host}`);

      const headers = new Headers();
      Object.entries(request.headers).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(v => headers.append(key, v));
        } else if (value) {
          headers.append(key, value.toString());
        }
      });

      const res = await auth.handler(
        new Request(url.toString(), {
          method: request.method,
          headers,
          body: request.body ? JSON.stringify(request.body) : undefined,
        })
      );

      reply.status(res.status);
      res.headers.forEach((value: string, key: string) => {
        reply.header(key, value);
      });

      return reply.send(await res.text());
    } catch (error) {
      fastify.log.error(error, "Authentication Error");
      return reply.status(500).send({
        error: "Internal authentication error",
        code: "AUTH_FAILURE"
      });
    }
  });
}
