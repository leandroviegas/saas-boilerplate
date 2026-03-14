import { UserAPI } from "../api/endpoints/user.api";
import { User } from "../models/user.model";
import { parseModel, parseModels } from "../utils/model-parser";
import { Paginated } from "../api/types/pagination";

export const UserService = {
  async getMe(): Promise<User> {
    const res = await UserAPI.getMe();
    return parseModel(res.data.data, User);
  },

  async getUser(id: string): Promise<User> {
    const res = await UserAPI.getUser(id);
    return parseModel(res.data.data, User);
  },

  async listUsers(params?: any): Promise<{ items: User[], total: number }> {
    const res = await UserAPI.listUsers(params);
    return {
      items: parseModels(res.data.data, User),
      total: res.data.meta.total
    };
  },

  async updateUser(id: string, data: any): Promise<User> {
    const res = await UserAPI.updateUser(id, data);
    return parseModel(res.data.data, User);
  },

  async deleteUser(id: string): Promise<void> {
    await UserAPI.deleteUser(id);
  }
};
