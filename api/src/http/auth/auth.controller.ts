import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { auth } from "@/auth";
import { authService } from "@/services";

export async function authController(fastify: FastifyInstance) {
  fastify.all("/*", {
    schema: {
      hide: true
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const authUrl = new URL(process.env.BETTER_AUTH_URL!);
    const url = new URL(`${authUrl.origin}${request.url}`);

    const headers = authService.buildHeaders(request.headers);

    const res = await auth.handler(
      new Request(url.toString(), {
        method: request.method,
        headers,
        body: request.body ? JSON.stringify(request.body) : undefined,
      })
    );

    const content = await res.text();

    return reply.send(content);
  });
}