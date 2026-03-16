import { SessionAPI } from "../api/endpoints/session.api";
import { SessionDTO } from "../models/session.model";
import { parseModels } from "../utils/model-parser";

export const SessionService = {
  async listSessions(): Promise<SessionDTO[]> {
    const res = await SessionAPI.listSessions();
    return parseModels(res.data.data, SessionDTO);
  },

  async revokeSession(id: string): Promise<void> {
    await SessionAPI.revokeSession(id);
  }
};
