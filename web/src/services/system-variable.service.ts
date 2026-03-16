import { SystemVariableAPI } from "../api/endpoints/system-variable.api";
import { SystemVariableDTO } from "../models/system-variable.model";
import { parseModel, parseModels } from "../utils/model-parser";

export const SystemVariableService = {
  async getSystemVariable(id: string): Promise<SystemVariableDTO> {
    const res = await SystemVariableAPI.getSystemVariable(id);
    return parseModel(res.data.data, SystemVariableDTO);
  },

  async listSystemVariables(params?: { page?: number; limit?: number }): Promise<{ items: SystemVariableDTO[], total: number }> {
    const res = await SystemVariableAPI.listSystemVariables(params);
    return {
      items: parseModels(res.data.data, SystemVariableDTO),
      total: res.data.meta.total
    };
  },

  async setSystemVariable(id: string, value: string): Promise<SystemVariableDTO> {
    const res = await SystemVariableAPI.setSystemVariable(id, value);
    return parseModel(res.data.data, SystemVariableDTO);
  },

  async updateSystemVariable(id: string, value: string): Promise<SystemVariableDTO> {
    const res = await SystemVariableAPI.updateSystemVariable(id, value);
    return parseModel(res.data.data, SystemVariableDTO);
  },

  async deleteSystemVariable(id: string): Promise<{ id: string }> {
    const res = await SystemVariableAPI.deleteSystemVariable(id);
    return res.data.data;
  }
};
