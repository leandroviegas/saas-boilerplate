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

      const url = new URL(`${authUrl.origin}${request.url}`);

      console.log(`[Auth-Incoming][${requestId}] --> ${method} ${url.toJSON()}`);

      console.log(`[Auth-Incoming][${requestId}] auth url --> ${process.env.BETTER_AUTH_URL}`);
      console.log(`[Auth-Incoming][${requestId}] request url --> ${request.url}`);
      
      // Header Transformation
      // Derive origin, host and x-forwarded-proto from the publicly-facing URL
      // (built above from BETTER_AUTH_URL) so that better-auth always resolves
      // the correct __Secure- prefixed cookies, regardless of whether the
      // internal hop between the reverse-proxy and this container uses HTTP.
      const headers = new Headers();

      Object.entries(request.headers).forEach(([key, value]) => {
        const lowerKey = key.toLowerCase();
        // These will be overridden below with values derived from `url`, and
        // the cookie header is handled separately to deduplicate same-name cookies.
        if (lowerKey === 'origin' || lowerKey === 'host' || lowerKey === 'x-forwarded-proto' || lowerKey === 'cookie') return;

        if (Array.isArray(value)) {
          value.forEach(v => headers.append(key, v));
        } else if (value) {
          headers.append(key, value.toString());
        }
      });

      // Set origin / host / x-forwarded-proto based on the constructed `url`
      // so better-auth treats the request as coming from the correct scheme.
      headers.set("origin", url.origin);
      headers.set("host", url.host);
      headers.set("x-forwarded-proto", url.protocol.replace(":", ""));

      // Deduplicate cookies: when the browser sends two cookies with the same
      // name (e.g. an old __Secure-better-auth.session_token alongside a newly
      // issued one), better-auth picks the first occurrence (the stale one),
      // fails validation, and clears all session cookies.
      // Keeping only the LAST value for each name ensures better-auth always
      // sees the most-recently issued token.
      const rawCookie = request.headers.cookie;
      if (rawCookie) {
        const cookieMap = new Map<string, string>();
        rawCookie.split(";").forEach(pair => {
          const idx = pair.indexOf("=");
          if (idx === -1) return;
          const name = pair.slice(0, idx).trim();
          const value = pair.slice(idx + 1).trim();
          cookieMap.set(name, value); // later duplicates overwrite earlier ones
        });
        headers.set("cookie", Array.from(cookieMap.entries()).map(([n, v]) => `${n}=${v}`).join("; "));
      }

      console.log(`[Auth-Incoming][${requestId}] --> ${JSON.stringify(Object.fromEntries(headers.entries()))}`);
      
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
      
      // Debug: Log Set-Cookie headers
      const setCookieHeader = res.headers.get("set-cookie");
      console.log(`[Auth-Handler][${requestId}] Set-Cookie:`, setCookieHeader);

      // Set headers from Auth Response to Fastify Reply
      reply.status(res.status);
      res.headers.forEach((value: string, key: string) => {
        // Log all Set-Cookie headers for debugging
        if (key.toLowerCase() === "set-cookie") {
          console.log(`[Auth-Handler][${requestId}] Forwarding Set-Cookie: ${value}`);
        }
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