import { api } from "../client";
import { DataSuccessResponse } from "../types/api-response";
import { SessionType } from "../../models/session.model";

export const SessionAPI = {
  async listSessions() {
    return api.get<DataSuccessResponse<SessionType[]>>(`/member/session`);
  },

  async revokeSession(id: string) {
    return api.delete(`/member/session/${id}`);
  }
};
