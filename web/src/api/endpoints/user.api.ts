import { api } from "../client";
import { ApiResponse } from "../types/api-response";
import { UserType } from "../../models/user.model";
import { Paginated } from "../types/pagination";

export const UserAPI = {
  async getMe() {
    return api.get<ApiResponse<UserType>>(`/member/user/me`);
  },

  async getUser(id: string) {
    return api.get<ApiResponse<UserType>>(`/admin/user/${id}`);
  },

  async listUsers(params?: any) {
    return api.get<ApiResponse<UserType[]> & { meta: any }>(`/admin/user`, { params });
  },

  async updateUser(id: string, data: any) {
    return api.put<ApiResponse<UserType>>(`/admin/user/${id}`, data);
  },

  async deleteUser(id: string) {
    return api.delete(`/admin/user/${id}`);
  }
};
