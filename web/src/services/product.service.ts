import { ProductAPI } from "../api/endpoints/product.api";
import { ProductDTO, ProductPriceDTO } from "../models/product.model";
import { parseModel, parseModels } from "../utils/model-parser";

export const ProductService = {
  async getProduct(id: string): Promise<ProductDTO> {
    const res = await ProductAPI.getProduct(id);
    return parseModel(res.data.data, ProductDTO);
  },

  async listProducts(params?: any): Promise<{ items: ProductDTO[], total: number }> {
    const res = await ProductAPI.listProducts(params);
    return {
      items: parseModels(res.data.data, ProductDTO),
      total: res.data.meta.total
    };
  },

  async createProduct(data: any): Promise<ProductDTO> {
    const res = await ProductAPI.createProduct(data);
    return parseModel(res.data.data, ProductDTO);
  },

  async updateProduct(id: string, data: any): Promise<ProductDTO> {
    const res = await ProductAPI.updateProduct(id, data);
    return parseModel(res.data.data, ProductDTO);
  },

  async deleteProduct(id: string): Promise<void> {
    await ProductAPI.deleteProduct(id);
  },

  async switchProductActive(id: string): Promise<ProductDTO> {
    const res = await ProductAPI.switchProductActive(id);
    return parseModel(res.data.data, ProductDTO);
  },

  // Prices
  async listPrices(params?: any): Promise<{ items: ProductPriceDTO[], total: number }> {
    const res = await ProductAPI.listPrices(params);
    return {
      items: parseModels(res.data.data, ProductPriceDTO),
      total: res.data.meta.total
    };
  },

  async createPrice(data: any): Promise<ProductPriceDTO> {
    const res = await ProductAPI.createPrice(data);
    return parseModel(res.data.data, ProductPriceDTO);
  },

  async updatePrice(id: string, data: any): Promise<ProductPriceDTO> {
    const res = await ProductAPI.updatePrice(id, data);
    return parseModel(res.data.data, ProductPriceDTO);
  },

  async deletePrice(id: string): Promise<void> {
    await ProductAPI.deletePrice(id);
  },

  async switchPriceActive(id: string): Promise<ProductPriceDTO> {
    const res = await ProductAPI.switchPriceActive(id);
    return parseModel(res.data.data, ProductPriceDTO);
  }
};
