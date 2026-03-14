import { api } from "../client";
import { ApiResponse } from "../types/api-response";
import { SessionDTO } from "../../models/session.model";

export const SessionAPI = {
  async listSessions() {
    return api.get<ApiResponse<SessionDTO[]>>(`/member/session`);
  },

  async revokeSession(id: string) {
    return api.delete(`/member/session/${id}`);
  }
};
