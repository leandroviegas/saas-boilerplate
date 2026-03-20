import { api } from "../client";
import { DataSuccessResponse, PaginatedSuccessResponse } from "../types/api-response";
import { ProductType, ProductPriceType } from "../../models/product.model";

export const ProductAPI = {
  async getProduct(id: string) {
    return api.get<DataSuccessResponse<ProductType>>(`/admin/product/${id}`);
  },

  async listProducts(params?: any) {
    return api.get<PaginatedSuccessResponse<ProductType[]>>(`/admin/product`, { params });
  },

  async createProduct(data: any) {
    return api.post<DataSuccessResponse<ProductType>>(`/admin/product`, data);
  },

  async updateProduct(id: string, data: any) {
    return api.put<DataSuccessResponse<ProductType>>(`/admin/product/${id}`, data);
  },

  async deleteProduct(id: string) {
    return api.delete(`/admin/product/${id}`);
  },

  async switchProductActive(id: string) {
    return api.patch<DataSuccessResponse<ProductType>>(`/admin/product/${id}/switch-active`);
  },

  // Prices
  async listPrices(params?: any) {
    return api.get<PaginatedSuccessResponse<ProductPriceType[]>>(`/admin/product-price`, { params });
  },

  async createPrice(data: any) {
    return api.post<DataSuccessResponse<ProductPriceType>>(`/admin/product-price`, data);
  },

  async updatePrice(id: string, data: any) {
    return api.put<DataSuccessResponse<ProductPriceType>>(`/admin/product-price/${id}`, data);
  },

  async deletePrice(id: string) {
    return api.delete(`/admin/product-price/${id}`);
  },

  async switchPriceActive(id: string) {
    return api.patch<DataSuccessResponse<ProductPriceType>>(`/admin/product-price/${id}/switch-active`);
  }
};
