import { NotificationAPI } from "../api/endpoints/notification.api";
import { NotificationDTO } from "../models/notification.model";
import { parseModel, parseModels } from "../utils/model-parser";

export const NotificationService = {
  async listNotifications(params?: any) {
    const res = await NotificationAPI.listNotifications(params);
    return {
      items: parseModels(res.data.data, NotificationDTO),
      meta: res.data.meta
    };
  },

  async markAsRead(id: string): Promise<NotificationDTO> {
    const res = await NotificationAPI.markAsRead(id);
    return parseModel(res.data.data, NotificationDTO);
  },

  async markAllAsRead(): Promise<void> {
    await NotificationAPI.markAllAsRead();
  },

  async deleteNotification(id: string): Promise<void> {
    await NotificationAPI.deleteNotification(id);
  },

  async deleteAllNotifications(): Promise<void> {
    await NotificationAPI.deleteAllNotifications();
  }
};
