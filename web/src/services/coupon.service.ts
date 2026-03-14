import { CouponAPI } from "../api/endpoints/coupon.api";
import { Coupon } from "../models/coupon.model";
import { parseModel, parseModels } from "../utils/model-parser";

export const CouponService = {
  async getCoupon(id: string): Promise<Coupon> {
    const res = await CouponAPI.getCoupon(id);
    return parseModel(res.data.data, Coupon);
  },

  async listCoupons(params?: any): Promise<{ items: Coupon[], total: number }> {
    const res = await CouponAPI.listCoupons(params);
    return {
      items: parseModels(res.data.data, Coupon),
      total: res.data.meta.total
    };
  },

  async createCoupon(data: any): Promise<Coupon> {
    const res = await CouponAPI.createCoupon(data);
    return parseModel(res.data.data, Coupon);
  },

  async updateCoupon(id: string, data: any): Promise<Coupon> {
    const res = await CouponAPI.updateCoupon(id, data);
    return parseModel(res.data.data, Coupon);
  },

  async deleteCoupon(id: string): Promise<void> {
    await CouponAPI.deleteCoupon(id);
  },

  async incrementUsage(id: string): Promise<Coupon> {
    const res = await CouponAPI.incrementUsage(id);
    return parseModel(res.data.data, Coupon);
  }
};
