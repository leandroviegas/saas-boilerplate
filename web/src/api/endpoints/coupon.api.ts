import { api } from "../client";
import { DataSuccessResponse, PaginatedSuccessResponse } from "../types/api-response";
import { CouponType } from "../../models/coupon.model";

export const CouponAPI = {
  async getCoupon(id: string) {
    return api.get<DataSuccessResponse<CouponType>>(`/admin/coupon/${id}`);
  },

  async listCoupons(params?: any) {
    return api.get<PaginatedSuccessResponse<CouponType[]>>(`/admin/coupon`, { params });
  },

  async createCoupon(data: any) {
    return api.post<DataSuccessResponse<CouponType>>(`/admin/coupon`, data);
  },

  async updateCoupon(id: string, data: any) {
    return api.put<DataSuccessResponse<CouponType>>(`/admin/coupon/${id}`, data);
  },

  async incrementUsage(id: string) {
    return api.post<DataSuccessResponse<CouponType>>(`/admin/coupon/${id}/increment-usage`);
  },

  async deleteCoupon(id: string) {
    return api.delete(`/admin/coupon/${id}`);
  },
};
