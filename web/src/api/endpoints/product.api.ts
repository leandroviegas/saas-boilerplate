import { api } from "../client";
import { ApiResponse } from "../types/api-response";
import { ProductType, ProductPriceType } from "../../models/product.model";

export const ProductAPI = {
  async getProduct(id: string) {
    return api.get<ApiResponse<ProductType>>(`/admin/product/${id}`);
  },

  async listProducts(params?: any) {
    return api.get<ApiResponse<ProductType[]> & { meta: any }>(`/admin/product`, { params });
  },

  async createProduct(data: any) {
    return api.post<ApiResponse<ProductType>>(`/admin/product`, data);
  },

  async updateProduct(id: string, data: any) {
    return api.put<ApiResponse<ProductType>>(`/admin/product/${id}`, data);
  },

  async deleteProduct(id: string) {
    return api.delete(`/admin/product/${id}`);
  },

  async switchProductActive(id: string) {
    return api.patch<ApiResponse<ProductType>>(`/admin/product/${id}/switch-active`);
  },

  // Prices
  async listPrices(params?: any) {
    return api.get<ApiResponse<ProductPriceType[]> & { meta: any }>(`/admin/product-price`, { params });
  },

  async createPrice(data: any) {
    return api.post<ApiResponse<ProductPriceType>>(`/admin/product-price`, data);
  },

  async updatePrice(id: string, data: any) {
    return api.put<ApiResponse<ProductPriceType>>(`/admin/product-price/${id}`, data);
  },

  async deletePrice(id: string) {
    return api.delete(`/admin/product-price/${id}`);
  },

  async switchPriceActive(id: string) {
    return api.patch<ApiResponse<ProductPriceType>>(`/admin/product-price/${id}/switch-active`);
  }
};
