import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { auth } from "@/auth";

export async function authController(fastify: FastifyInstance) {
  fastify.all("/*", {
    schema: {
      hide: true
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const authUrl = new URL(process.env.BETTER_AUTH_URL!)
    const url = new URL(`${authUrl.origin}${request.url}`);

    const headers = new Headers();

    Object.entries(request.headers).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => headers.append(key, v));
      } else if (value) {
        headers.append(key, value.toString());
      }
    });

    headers.set("origin", url.origin);
    headers.set("host", url.host);

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