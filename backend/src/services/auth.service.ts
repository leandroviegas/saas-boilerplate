import { IncomingHttpHeaders } from "http";
import { auth } from "../auth";
import { AbstractService } from "@/services/abstract.service";
import { parseHeaders } from "@/utils/parseFastifyHeaders";

export class AuthService extends AbstractService {
  async session(reqHeaders: IncomingHttpHeaders) {
    const headers = parseHeaders(reqHeaders);
    return await auth.api.getSession({ headers });
  }

  async hasPermission(reqHeaders: IncomingHttpHeaders, area: string, permissions: string[]) {
    const headers = parseHeaders(reqHeaders);
    const hasAccess = await auth.api.hasPermission({
      headers,
      body: {
        permission: {
          [area]: permissions
        }
      }
    });

    if (!hasAccess) {
      throw new Error("Unauthorized");
    }
  }

}