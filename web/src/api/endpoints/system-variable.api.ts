import { SystemVariableType } from "@/models/schemas/system-variable.schema";
import { api } from "../client";
import { DataSuccessResponse, PaginatedSuccessResponse } from "../types/api-response";


export const SystemVariableAPI = {
  async listSystemVariables(params?: { page?: number; limit?: number }) {
    return api.get<PaginatedSuccessResponse<SystemVariableType[]>>(`/admin/system-variable`, { params });
  },

  async getSystemVariable(id: string) {
    return api.get<DataSuccessResponse<SystemVariableType>>(`/admin/system-variable/${id}`);
  },

  async setSystemVariable(id: string, value: string) {
    return api.post<DataSuccessResponse<SystemVariableType>>(`/admin/system-variable`, { id, value });
  },

  async updateSystemVariable(id: string, value: string) {
    return api.put<DataSuccessResponse<SystemVariableType>>(`/admin/system-variable/${id}`, { value });
  },

  async deleteSystemVariable(id: string) {
    return api.delete<DataSuccessResponse<{ id: string }>>(`/admin/system-variable/${id}`);
  }
};
