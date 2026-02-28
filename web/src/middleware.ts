import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { env } from './lib/config';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestId = Math.random().toString(36).substring(7); // Correlation ID for log tracing

  let userData = null;
  let errorCode = null;

  // 1. Filter internal/static assets
  if (
    !pathname.startsWith("/_next") &&
    !pathname.startsWith("/public") &&
    !pathname.startsWith("/images")
  ) {
    console.log(`[Middleware][${requestId}] Request Path: ${pathname}`);

    try {
      const apiBaseUrl = process.env.INTERNAL_API_URL || env.NEXT_PUBLIC_API_URL;
      const targetUrl = `${apiBaseUrl}/auth/get-session`;
    
      console.log(`[Middleware] Target URL: ${targetUrl}`);

      console.log(`[Middleware] headers: ${Object.fromEntries(request.headers.entries())}`);

      const res = await fetch(targetUrl, {
        headers: Object.fromEntries(request.headers.entries()),
        credentials: "include",
      });

      console.log(`[Middleware][${requestId}] Fetch Status: ${res.status} (${res.statusText})`);

      if (res.ok) {
        try {
          const data = await res.json();
            console.log(`[Middleware][${requestId}] data:`, data);

          if (data.user) {
            userData = data.user;
            console.log(`[Middleware][${requestId}] User Authenticated:`, userData.id || 'ID Hidden');
          } else {
            console.log(`[Middleware][${requestId}] Session found, but no user data returned.`);
          }
        } catch (parseError) {
          console.error(`[Middleware][${requestId}] JSON Parse Error:`, parseError);
        }
      } else {
        console.warn(`[Middleware][${requestId}] Auth API failed: ${res.status}`);
      }

    } catch (e: any) {
      errorCode = e?.code ?? e?.cause?.code;
      console.error(`[Middleware][${requestId}] Network/Fetch Error:`, {
        message: e.message,
        code: errorCode,
        stack: e.stack?.split('\n')[0]
      });
    }
  }

  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);

  // 2. Logic Handling & Redirection
  if (userData) {
    const encoded = Buffer.from(JSON.stringify(userData)).toString("base64");
    response.cookies.set("me", encoded, {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
    });

    if (pathname.startsWith('/auth')) {
      console.log(`[Middleware][${requestId}] Redirecting Authed user from /auth to /dashboard`);
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  } else {
    if (errorCode === 'ECONNREFUSED') {
      console.error(`[Middleware][${requestId}] critical: API Offline. Rewriting to /offline`);
      return NextResponse.rewrite(new URL("/offline", request.url));
    }

    response.cookies.delete("me");

    if (pathname.startsWith('/dashboard')) {
      console.log(`[Middleware][${requestId}] Unauthorized access to /dashboard. Redirecting to /auth`);
      return NextResponse.redirect(new URL("/auth", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public|images|offline).*)"],
};