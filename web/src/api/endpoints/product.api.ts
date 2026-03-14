import { api } from "../client";
import { ApiResponse } from "../types/api-response";
import { ProductDTO, ProductPriceDTO } from "../../models/product.model";

export const ProductAPI = {
  async getProduct(id: string) {
    return api.get<ApiResponse<ProductDTO>>(`/admin/product/${id}`);
  },

  async listProducts(params?: any) {
    return api.get<ApiResponse<ProductDTO[]> & { meta: any }>(`/admin/product`, { params });
  },

  async createProduct(data: any) {
    return api.post<ApiResponse<ProductDTO>>(`/admin/product`, data);
  },

  async updateProduct(id: string, data: any) {
    return api.put<ApiResponse<ProductDTO>>(`/admin/product/${id}`, data);
  },

  async deleteProduct(id: string) {
    return api.delete(`/admin/product/${id}`);
  },

  async switchProductActive(id: string) {
    return api.patch<ApiResponse<ProductDTO>>(`/admin/product/${id}/switch-active`);
  },

  // Prices
  async listPrices(params?: any) {
    return api.get<ApiResponse<ProductPriceDTO[]> & { meta: any }>(`/admin/product-price`, { params });
  },

  async createPrice(data: any) {
    return api.post<ApiResponse<ProductPriceDTO>>(`/admin/product-price`, data);
  },

  async updatePrice(id: string, data: any) {
    return api.put<ApiResponse<ProductPriceDTO>>(`/admin/product-price/${id}`, data);
  },

  async deletePrice(id: string) {
    return api.delete(`/admin/product-price/${id}`);
  },

  async switchPriceActive(id: string) {
    return api.patch<ApiResponse<ProductPriceDTO>>(`/admin/product-price/${id}/switch-active`);
  }
};
