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
      // Use INTERNAL_API_URL for server-to-server communication in Docker/Dokploy
      // Fall back to NEXT_PUBLIC_API_URL if not available
      const apiBaseUrl = process.env.INTERNAL_API_URL || env.NEXT_PUBLIC_API_URL;

      if (!apiBaseUrl) {
        console.log("[session] No API URL configured");
        code = "NO_API_URL";
      } else {
        console.log("[session] apiBaseUrl", apiBaseUrl);
        console.log("[session] apiBaseUrl", `${apiBaseUrl}/api/v1/auth/get-session`);


        const res = await fetch(`${apiBaseUrl}/api/v1/auth/get-session`, {
          headers: Object.fromEntries(request.headers.entries()),
          credentials: "include",
        });

        console.log("[session] content: ", res);

        if (res.ok) {
          try {
            const content = await res.text();
            console.log("[session] content: ", content);

            const data = JSON.parse(content);
            console.log("[session] data: ", content);

            if (data.user) {
              userData = data.user;
              console.log("[session] user: ", data.user);
            }
          } catch (e) {
            console.log("[session] JSON parse error:", e);
          }
        } else {
          console.log("[session] API returned error:", res.status, res.statusText);
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
      return NextResponse.redirect(new URL("/dashboard", request.url), {
        status: 302,
      });
    }
  } else {
    if (code == 'ECONNREFUSED')
      return NextResponse.rewrite(new URL("/offline", request.url));

    response.cookies.delete("me");
    if (pathname.startsWith('/dashboard'))
      return NextResponse.redirect(new URL("/auth", request.url), {
        status: 302,
      });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public|images|offline).*)"],
};