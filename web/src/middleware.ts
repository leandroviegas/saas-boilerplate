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
      const res = await fetch(`${apiBaseUrl}/api/v1/auth/get-session`, {
        headers: Object.fromEntries(request.headers.entries()),
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