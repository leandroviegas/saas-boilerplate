import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { env } from './lib/config';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let userData, code;

  if (
    !pathname.startsWith("/_next") &&
    !pathname.startsWith("/public") &&
    !pathname.startsWith("/images")
  ) {
    try {
      const apiBaseUrl = process.env.INTERNAL_API_URL || env.NEXT_PUBLIC_API_URL;

      // Filter out Cloudflare and other proxy headers that may cause issues
      const headersToForward: Record<string, string> = {};
      const prohibitedHeaders = [
        'cf-ray',
        'cf-request-id',
        'cf-connecting-ip',
        'cf-ipcountry',
        'cf-visitor',
        'cf-worker',
        'cf-cache-status',
        'cf-dualstack',
        'x-forwarded-for',
        'x-real-ip',
        'x-forwarded-proto',
        'x-forwarded-host',
        'x-forwarded-port',
        'forwarded',
        'true-client-ip',
        'client-ip',
        'x-cluster-client-ip',
        'x-az',
        'x-served-by',
        'x-cdn',
        'x-cdn-rc',
        'x-cache',
        'x-cache-hits',
        'x-id',
        'x-github-request-id',
        'x-kubernetes-ingress-uid',
        'x-kubernetes-namespace',
        'x-amz-cf-id',
        'x-amz-cf-pop',
        'x-edge-ip',
        'x-edge-location',
        'x-scheme',
        'x-original-forwarded-for',
        'x-original-url',
        'x-rewrite-url',
        'x-correlation-id',
        'x-request-id',
        'x-requeststart',
        'x-response-time',
        'x-timer',
        'via',
        'upgrade-insecure-requests',
        'sec-websocket-key',
        'sec-websocket-version',
        'sec-websocket-extensions',
        'sec-websocket-protocol',
      ];

      for (const [key, value] of request.headers.entries()) {
        const lowerKey = key.toLowerCase();
        if (!prohibitedHeaders.includes(lowerKey)) {
          headersToForward[key] = value;
        }
      }

      const res = await fetch(`${apiBaseUrl}/api/v1/auth/get-session`, {
        headers: headersToForward,
        credentials: "include",
      });

      if (res.ok) {
        try {
          const data = await res.json();

          if (data.user) {
            userData = data.user;
          }
        } catch (e) {
          console.log("[session] JSON parse error:", e);
        }
      }

    } catch (e: any) {
      console.log("[session] Fetch error:", e);
      code = e?.cause?.code ?? code;
    }
  }

  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);

  if (userData) {
    const encoded = Buffer.from(JSON.stringify(userData)).toString("base64");
    response.cookies.set("me", encoded, {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
    });
    if (['/auth'].includes(pathname)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  } else {
    if (code == 'ECONNREFUSED')
      return NextResponse.rewrite(new URL("/offline", request.url));
    
    response.cookies.delete("me");
    if (pathname.startsWith('/dashboard'))
      return NextResponse.redirect(new URL("/auth", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public|images|offline).*)"],
};