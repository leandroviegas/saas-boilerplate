import { RoleAPI } from "../api/endpoints/role.api";
import { Role } from "../models/role.model";
import { parseModel, parseModels } from "../utils/model-parser";

export const RoleService = {
  async listRoles(): Promise<Role[]> {
    const res = await RoleAPI.listRoles();
    return parseModels(res.data.data, Role);
  },

  async getRole(slug: string): Promise<Role> {
    const res = await RoleAPI.getRole(slug);
    return parseModel(res.data.data, Role);
  },

  async createRole(data: any): Promise<Role> {
    const res = await RoleAPI.createRole(data);
    return parseModel(res.data.data, Role);
  },

  async updateRole(slug: string, data: any): Promise<Role> {
    const res = await RoleAPI.updateRole(slug, data);
    return parseModel(res.data.data, Role);
  },

  async deleteRole(slug: string): Promise<void> {
    await RoleAPI.deleteRole(slug);
  },

  // Role Permissions
  async listRolePermissions(): Promise<any[]> {
    const res = await RoleAPI.listRolePermissions();
    return res.data.data;
  },

  async getRolePermission(organizationId: string, roleSlug: string): Promise<any> {
    const res = await RoleAPI.getRolePermission(organizationId, roleSlug);
    return res.data.data;
  },

  async upsertRolePermission(data: any): Promise<any> {
    const res = await RoleAPI.upsertRolePermission(data);
    return res.data.data;
  },

  async deleteRolePermission(organizationId: string, roleSlug: string): Promise<void> {
    await RoleAPI.deleteRolePermission(organizationId, roleSlug);
  }
};
