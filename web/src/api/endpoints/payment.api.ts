import { api } from "../client";
import { DataSuccessResponse, DefaultResponse, PaginatedSuccessResponse } from "../types/api-response";
import { SubscriptionType, TransactionType } from "../../models/subscription.model";
import { ProductType } from "../../models/product.model";

export const PaymentAPI = {
  async listProducts(params?: any) {
    return api.get<PaginatedSuccessResponse<ProductType[]>>(`/member/payment/products`, { params });
  },

  async createCheckoutSession(data: any) {
    return api.post<DataSuccessResponse<{ url: string }>>(`/member/payment/checkout`, data);
  },

  async getSubscription() {
    return api.get<DataSuccessResponse<SubscriptionType>>(`/member/payment/subscription`);
  },

  async cancelSubscription() {
    return api.post<DefaultResponse>(`/member/payment/cancel-subscription`);
  },

  async listTransactions(params?: any) {
    return api.get<PaginatedSuccessResponse<TransactionType[]>>(`/member/payment/transactions`, { params });
  }
};
