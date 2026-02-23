import { IncomingHttpHeaders } from "http";

export function parseHeaders(reqHeaders: IncomingHttpHeaders) {
  const headers = new Headers();
  Object.entries(reqHeaders).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(v => headers.append(key, v));
    } else if (value) {
      headers.append(key, value.toString());
    }
  });
  return headers;
}