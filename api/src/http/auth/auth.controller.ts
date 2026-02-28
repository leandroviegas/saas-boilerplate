import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { auth } from "@/auth";

export async function authController(fastify: FastifyInstance) {
  fastify.all("/*", {
    schema: {
      hide: true
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const requestId = request.id || Math.random().toString(36).substring(7);
    const method = request.method;
    
    try {
      const authUrl = new URL(process.env.BETTER_AUTH_URL!)

      const url = new URL(`${authUrl.host}${request.url}`);

      console.log(`[Auth-Incoming][${requestId}] --> ${method} ${url.toJSON()}`);

      // Header Transformation
      const headers = new Headers();
      Object.entries(request.headers).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(v => headers.append(key, v));
        } else if (value) {
          headers.append(key, value.toString());
        }
      });

      console.log(`[Auth-Incoming][${requestId}] --> ${headers}`);
      
      // Execute Auth Handler
      console.log(`[Auth-Handler][${requestId}] Executing auth.handler...`);
      
      const res = await auth.handler(
        new Request(url.toString(), {
          method: method,
          headers,
          body: request.body ? JSON.stringify(request.body) : undefined,
        })
      );

      // Log Outgoing Response Status
      console.log(`[Auth-Handler][${requestId}] Status: ${res.status} (${res.statusText})`);

      // Set headers from Auth Response to Fastify Reply
      reply.status(res.status);
      res.headers.forEach((value: string, key: string) => {
        reply.header(key, value);
      });

      const content = await res.text();

      // Debugging Payload (truncated if too large)
      const logContent = content.length > 500 ? `${content.substring(0, 500)}... [Truncated]` : content;
      console.log(`[Auth-Payload][${requestId}] Content:`, logContent);

      return reply.send(content);
    } catch (error: any) {
      console.error(`[Auth-Error][${requestId}] Critical Failure:`, {
        message: error.message,
        stack: error.stack?.split('\n')[0],
        path: request.url
      });

      fastify.log.error(error, "Authentication Error");
      
      return reply.status(500).send({
        error: "Internal authentication error",
        code: "AUTH_FAILURE",
        requestId // Returning ID for easier log correlation
      });
    }
  });
}