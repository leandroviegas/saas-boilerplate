import { IncomingHttpHeaders } from "http";
import { auth } from "../auth";
import { AbstractService } from "@/services/abstract.service";

export class AuthService extends AbstractService {
  buildHeaders(reqHeaders: IncomingHttpHeaders): Headers {
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

    return headers;
  }

  async session(reqHeaders: IncomingHttpHeaders) {
    const headers = this.buildHeaders(reqHeaders);
    return await auth.api.getSession({ headers });
  }
}