import { api } from "../client";
import { DataSuccessResponse, PaginatedSuccessResponse } from "../types/api-response";
import { UserType } from "../../models/user.model";

export const UserAPI = {
  async getMe() {
    return api.get<DataSuccessResponse<UserType>>(`/member/user/me`);
  },

  async getUser(id: string) {
    return api.get<DataSuccessResponse<UserType>>(`/admin/user/${id}`);
  },

  async listUsers(params?: any) {
    return api.get<PaginatedSuccessResponse<UserType[]>>(`/admin/user`, { params });
  },

  async updateUser(id: string, data: any) {
    return api.put<DataSuccessResponse<UserType>>(`/admin/user/${id}`, data);
  },

  async deleteUser(id: string) {
    return api.delete(`/admin/user/${id}`);
  }
};
