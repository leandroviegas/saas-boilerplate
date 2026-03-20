import { UserAPI } from "../api/endpoints/user.api";
import { UserDTO } from "../models/user.model";
import { parseModel, parseModels } from "../utils/model-parser";

export const UserService = {
  async getMe(): Promise<UserDTO> {
    const res = await UserAPI.getMe();
    return parseModel(res.data.data, UserDTO);
  },

  async getUser(id: string): Promise<UserDTO> {
    const res = await UserAPI.getUser(id);
    return parseModel(res.data.data, UserDTO);
  },

  async listUsers(params?: any): Promise<{ items: UserDTO[], total: number }> {
    const res = await UserAPI.listUsers(params);
    return {
      items: parseModels(res.data.data, UserDTO),
      total: res.data.meta.total
    };
  },

  async updateUser(id: string, data: any): Promise<UserDTO> {
    const res = await UserAPI.updateUser(id, data);
    return parseModel(res.data.data, UserDTO);
  },

  async deleteUser(id: string): Promise<void> {
    await UserAPI.deleteUser(id);
  }
};
