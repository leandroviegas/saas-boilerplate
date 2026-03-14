import { api } from "../client";
import { ApiResponse } from "../types/api-response";
import { CouponDTO } from "../../models/coupon.model";

export const CouponAPI = {
  async getCoupon(id: string) {
    return api.get<ApiResponse<CouponDTO>>(`/admin/coupon/${id}`);
  },

  async listCoupons(params?: any) {
    return api.get<ApiResponse<CouponDTO[]> & { meta: any }>(`/admin/coupon`, { params });
  },

  async createCoupon(data: any) {
    return api.post<ApiResponse<CouponDTO>>(`/admin/coupon`, data);
  },

  async updateCoupon(id: string, data: any) {
    return api.put<ApiResponse<CouponDTO>>(`/admin/coupon/${id}`, data);
  },

  async deleteCoupon(id: string) {
    return api.delete(`/admin/coupon/${id}`);
  },

  async incrementUsage(id: string) {
    return api.post<ApiResponse<CouponDTO>>(`/admin/coupon/${id}/increment-usage`);
  }
};
