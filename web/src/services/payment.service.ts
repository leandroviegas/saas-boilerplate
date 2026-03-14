import { PaymentAPI } from "../api/endpoints/payment.api";
import { Subscription, Transaction } from "../models/subscription.model";
import { Product } from "../models/product.model";
import { parseModel, parseModels } from "../utils/model-parser";

export const PaymentService = {
  async listProducts(params?: any): Promise<{ items: Product[], total: number }> {
    const res = await PaymentAPI.listProducts(params);
    return {
      items: parseModels(res.data.data, Product),
      total: res.data.meta.total
    };
  },

  async createCheckoutSession(data: any): Promise<{ url: string }> {
    const res = await PaymentAPI.createCheckoutSession(data);
    return res.data.data;
  },

  async getSubscription(): Promise<Subscription> {
    const res = await PaymentAPI.getSubscription();
    return parseModel(res.data.data, Subscription);
  },

  async cancelSubscription(): Promise<void> {
    await PaymentAPI.cancelSubscription();
  },

  async listTransactions(params?: any): Promise<{ items: Transaction[], total: number }> {
    const res = await PaymentAPI.listTransactions(params);
    return {
      items: parseModels(res.data.data, Transaction),
      total: res.data.meta.total
    };
  }
};
