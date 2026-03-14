import { api } from "../client";
import { ApiResponse } from "../types/api-response";
import { NotificationDTO } from "../../models/notification.model";

export const NotificationAPI = {
  async listNotifications(params?: any) {
    return api.get<ApiResponse<NotificationDTO[]> & { meta: any }>(`/member/notification`, { params });
  },

  async markAsRead(id: string) {
    return api.patch<ApiResponse<NotificationDTO>>(`/member/notification/${id}/read`);
  },

  async markAllAsRead() {
    return api.patch<ApiResponse<void>>(`/member/notification/read-all`);
  },

  async deleteNotification(id: string) {
    return api.delete(`/member/notification/${id}`);
  },

  async deleteAllNotifications() {
    return api.delete(`/member/notification/all`);
  }
};
