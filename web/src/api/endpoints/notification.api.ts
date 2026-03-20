import { api } from "../client";
import { DataSuccessResponse, DefaultResponse, PaginatedSuccessResponse } from "../types/api-response";
import { NotificationType } from "../../models/notification.model";

export const NotificationAPI = {
  async listNotifications(params?: any) {
    return api.get<PaginatedSuccessResponse<NotificationType[]>>(`/member/notification`, { params });
  },

  async markAsRead(id: string) {
    return api.patch<DataSuccessResponse<NotificationType>>(`/member/notification/${id}/read`);
  },

  async markAllAsRead() {
    return api.patch<DefaultResponse>(`/member/notification/read-all`);
  },

  async deleteNotification(id: string) {
    return api.delete(`/member/notification/${id}`);
  },

  async deleteAllNotifications() {
    return api.delete(`/member/notification/all`);
  }
};
