import { api } from "../client";
import { ApiResponse } from "../types/api-response";
import { SubscriptionType, TransactionType } from "../../models/subscription.model";
import { ProductType } from "../../models/product.model";

export const PaymentAPI = {
  async listProducts(params?: any) {
    return api.get<ApiResponse<ProductType[]> & { meta: any }>(`/member/payment/products`, { params });
  },

  async createCheckoutSession(data: any) {
    return api.post<ApiResponse<{ url: string }>>(`/member/payment/checkout`, data);
  },

  async getSubscription() {
    return api.get<ApiResponse<SubscriptionType>>(`/member/payment/subscription`);
  },

  async cancelSubscription() {
    return api.post<ApiResponse<void>>(`/member/payment/cancel-subscription`);
  },

  async listTransactions(params?: any) {
    return api.get<ApiResponse<TransactionType[]> & { meta: any }>(`/member/payment/transactions`, { params });
  }
};
