import { PaymentAPI } from "../api/endpoints/payment.api";
import { SubscriptionDTO, TransactionDTO } from "../models/subscription.model";
import { ProductDTO } from "../models/product.model";
import { parseModel, parseModels } from "../utils/model-parser";

export const PaymentService = {
  async listProducts(params?: any): Promise<{ items: ProductDTO[], total: number }> {
    const res = await PaymentAPI.listProducts(params);
    return {
      items: parseModels(res.data.data, ProductDTO),
      total: res.data.meta.total
    };
  },

  async createCheckoutSession(data: any): Promise<{ url: string }> {
    const res = await PaymentAPI.createCheckoutSession(data);
    return res.data.data;
  },

  async getSubscription(): Promise<SubscriptionDTO> {
    const res = await PaymentAPI.getSubscription();
    return parseModel(res.data.data, SubscriptionDTO);
  },

  async cancelSubscription(): Promise<void> {
    await PaymentAPI.cancelSubscription();
  },

  async listTransactions(params?: any): Promise<{ items: TransactionDTO[], total: number }> {
    const res = await PaymentAPI.listTransactions(params);
    return {
      items: parseModels(res.data.data, TransactionDTO),
      total: res.data.meta.total
    };
  }
};
