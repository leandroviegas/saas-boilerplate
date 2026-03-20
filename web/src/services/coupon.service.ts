import { CouponAPI } from "../api/endpoints/coupon.api";
import { CouponDTO } from "../models/coupon.model";
import { parseModel, parseModels } from "../utils/model-parser";

export const CouponService = {
  async getCoupon(id: string): Promise<CouponDTO> {
    const res = await CouponAPI.getCoupon(id);
    return parseModel(res.data.data, CouponDTO);
  },

  async listCoupons(params?: any) {
    const res = await CouponAPI.listCoupons(params);
    return {
      items: parseModels(res.data.data, CouponDTO),
      total: res.data.meta.total
    };
  },

  async createCoupon(data: any): Promise<CouponDTO> {
    const res = await CouponAPI.createCoupon(data);
    return parseModel(res.data.data, CouponDTO);
  },

  async updateCoupon(id: string, data: any): Promise<CouponDTO> {
    const res = await CouponAPI.updateCoupon(id, data);
    return parseModel(res.data.data, CouponDTO);
  },

  async deleteCoupon(id: string): Promise<void> {
    await CouponAPI.deleteCoupon(id);
  },

  async incrementUsage(id: string): Promise<CouponDTO> {
    const res = await CouponAPI.incrementUsage(id);
    return parseModel(res.data.data, CouponDTO);
  }
};
