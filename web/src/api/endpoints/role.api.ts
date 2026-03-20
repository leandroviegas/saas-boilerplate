import { api } from "../client";
import { DataSuccessResponse } from "../types/api-response";
import { RoleType } from "../../models/role.model";

export const RoleAPI = {
  async listRoles() {
    return api.get<DataSuccessResponse<RoleType[]>>(`/admin/role`);
  },

  async getRole(slug: string) {
    return api.get<DataSuccessResponse<RoleType>>(`/admin/role/${slug}`);
  },

  async createRole(data: any) {
    return api.post<DataSuccessResponse<RoleType>>(`/admin/role`, data);
  },

  async updateRole(slug: string, data: any) {
    return api.put<DataSuccessResponse<RoleType>>(`/admin/role/${slug}`, data);
  },

  async deleteRole(slug: string) {
    return api.delete(`/admin/role/${slug}`);
  },

  // Role Permissions
  async listRolePermissions() {
    return api.get<DataSuccessResponse<any[]>>(`/admin/role-permission`);
  },

  async getRolePermission(organizationId: string, roleSlug: string) {
    return api.get<DataSuccessResponse<any>>(`/admin/role-permission/${organizationId}/${roleSlug}`);
  },

  async upsertRolePermission(data: any) {
    return api.post<DataSuccessResponse<any>>(`/admin/role-permission`, data);
  },

  async deleteRolePermission(organizationId: string, roleSlug: string) {
    return api.delete(`/admin/role-permission/${organizationId}/${roleSlug}`);
  }
};
