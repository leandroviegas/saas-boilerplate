import { SessionAPI } from "../api/endpoints/session.api";
import { Session } from "../models/session.model";
import { parseModels } from "../utils/model-parser";

export const SessionService = {
  async listSessions(): Promise<Session[]> {
    const res = await SessionAPI.listSessions();
    return parseModels(res.data.data, Session);
  },

  async revokeSession(id: string): Promise<void> {
    await SessionAPI.revokeSession(id);
  }
};
