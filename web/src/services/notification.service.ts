import { NotificationAPI } from "../api/endpoints/notification.api";
import { Notification } from "../models/notification.model";
import { parseModel, parseModels } from "../utils/model-parser";

export const NotificationService = {
  async listNotifications(params?: any): Promise<{ items: Notification[], total: number }> {
    const res = await NotificationAPI.listNotifications(params);
    return {
      items: parseModels(res.data.data, Notification),
      total: res.data.meta.total
    };
  },

  async markAsRead(id: string): Promise<Notification> {
    const res = await NotificationAPI.markAsRead(id);
    return parseModel(res.data.data, Notification);
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
