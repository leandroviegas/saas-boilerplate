import { IncomingHttpHeaders } from "http";
import { auth } from "../auth";
import { AbstractService } from "@/services/abstract.service";

export class AuthService extends AbstractService {
  buildHeaders(reqHeaders: IncomingHttpHeaders) {
    const authUrl = new URL(process.env.BETTER_AUTH_URL!);
    const headers = new Headers();

    Object.entries(reqHeaders).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => headers.append(key, v));
      } else if (value) {
        headers.append(key, value.toString());
      }
    });

    headers.set("origin", authUrl.origin);
    headers.set("host", authUrl.host);
    headers.set("x-forwarded-proto", authUrl.protocol.replace(":", ""));
    const rawCookie = reqHeaders.cookie;
    if (rawCookie) {
      const cookieMap = new Map<string, string>();
      rawCookie.split(";").forEach(pair => {
        const idx = pair.indexOf("=");
        if (idx === -1) return;
        const name = pair.slice(0, idx).trim();
        const value = pair.slice(idx + 1).trim();
        cookieMap.set(name, value);
      });
      headers.set("cookie", Array.from(cookieMap.entries()).map(([n, v]) => `${n}=${v}`).join("; "));
    }
    return headers;
  }

  async session(reqHeaders: IncomingHttpHeaders) {
    const headers = this.buildHeaders(reqHeaders);
    return await auth.api.getSession({ headers });
  }
}