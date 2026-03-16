import { api } from "../client";
import { ApiResponse } from "../types/api-response";

export interface SystemVariableDTO {
  id: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

export interface SystemVariablesResponse extends ApiResponse<SystemVariableDTO[]> {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const SystemVariableAPI = {
  async listSystemVariables(params?: { page?: number; limit?: number }) {
    return api.get<SystemVariablesResponse>(`/admin/system-variable`, { params });
  },

  async getSystemVariable(id: string) {
    return api.get<ApiResponse<SystemVariableDTO>>(`/admin/system-variable/${id}`);
  },

  async setSystemVariable(id: string, value: string) {
    return api.post<ApiResponse<SystemVariableDTO>>(`/admin/system-variable`, { id, value });
  },

  async updateSystemVariable(id: string, value: string) {
    return api.put<ApiResponse<SystemVariableDTO>>(`/admin/system-variable/${id}`, { value });
  },

  async deleteSystemVariable(id: string) {
    return api.delete<ApiResponse<{ id: string }>>(`/admin/system-variable/${id}`);
  }
};
