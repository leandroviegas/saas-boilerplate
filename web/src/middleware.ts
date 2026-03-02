import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { env } from './lib/config';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let userData, errorCode;

  if (
    !pathname.startsWith("/_next") &&
    !pathname.startsWith("/public") &&
    !pathname.startsWith("/images")
  ) {
    try {
      const apiBaseUrl = process.env.INTERNAL_API_URL || env.NEXT_PUBLIC_API_URL;
      const targetUrl = `${apiBaseUrl}/auth/get-session`;

      const res = await fetch(targetUrl, {
        headers: Object.fromEntries(request.headers.entries()),
        credentials: "include",
      });

      if (res.ok) {
        try {
          const data = await res.json();

          if (data?.user) {
            userData = data.user;
          }
        } catch (parseError) {
          throw parseError;
        }
      }

    } catch (e: any) {
      errorCode = e?.code ?? e?.cause?.code;
      console.error(`[Middleware] Network/Fetch Error:`, {
        message: e.message,
        code: errorCode,
        stack: e.stack?.split('\n')[0]
      });
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

    if (pathname.startsWith('/auth')) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  } else {
    if (errorCode === 'ECONNREFUSED') {
      return NextResponse.rewrite(new URL("/offline", request.url));
    }

    response.cookies.delete("me");

    if (pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public|images|offline).*)"],
};