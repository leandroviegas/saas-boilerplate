import { api } from "../client";
import { ApiResponse } from "../types/api-response";
import { RoleDTO } from "../../models/role.model";

export const RoleAPI = {
  async listRoles() {
    return api.get<ApiResponse<RoleDTO[]>>(`/admin/role`);
  },

  async getRole(slug: string) {
    return api.get<ApiResponse<RoleDTO>>(`/admin/role/${slug}`);
  },

  async createRole(data: any) {
    return api.post<ApiResponse<RoleDTO>>(`/admin/role`, data);
  },

  async updateRole(slug: string, data: any) {
    return api.put<ApiResponse<RoleDTO>>(`/admin/role/${slug}`, data);
  },

  async deleteRole(slug: string) {
    return api.delete(`/admin/role/${slug}`);
  },

  // Role Permissions
  async listRolePermissions() {
    return api.get<ApiResponse<any[]>>(`/admin/role-permission`);
  },

  async getRolePermission(organizationId: string, roleSlug: string) {
    return api.get<ApiResponse<any>>(`/admin/role-permission/${organizationId}/${roleSlug}`);
  },

  async upsertRolePermission(data: any) {
    return api.post<ApiResponse<any>>(`/admin/role-permission`, data);
  },

  async deleteRolePermission(organizationId: string, roleSlug: string) {
    return api.delete(`/admin/role-permission/${organizationId}/${roleSlug}`);
  }
};
