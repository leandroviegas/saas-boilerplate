import { api } from "../client";
import { ApiResponse } from "../types/api-response";
import { UserDTO } from "../../models/user.model";
import { Paginated } from "../types/pagination";

export const UserAPI = {
  async getMe() {
    return api.get<ApiResponse<UserDTO>>(`/member/user/me`);
  },

  async getUser(id: string) {
    return api.get<ApiResponse<UserDTO>>(`/admin/user/${id}`);
  },

  async listUsers(params?: any) {
    return api.get<ApiResponse<UserDTO[]> & { meta: any }>(`/admin/user`, { params });
  },

  async updateUser(id: string, data: any) {
    return api.put<ApiResponse<UserDTO>>(`/admin/user/${id}`, data);
  },

  async deleteUser(id: string) {
    return api.delete(`/admin/user/${id}`);
  }
};
