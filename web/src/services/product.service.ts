import { ProductAPI } from "../api/endpoints/product.api";
import { Product, ProductPrice } from "../models/product.model";
import { parseModel, parseModels } from "../utils/model-parser";

export const ProductService = {
  async getProduct(id: string): Promise<Product> {
    const res = await ProductAPI.getProduct(id);
    return parseModel(res.data.data, Product);
  },

  async listProducts(params?: any): Promise<{ items: Product[], total: number }> {
    const res = await ProductAPI.listProducts(params);
    return {
      items: parseModels(res.data.data, Product),
      total: res.data.meta.total
    };
  },

  async createProduct(data: any): Promise<Product> {
    const res = await ProductAPI.createProduct(data);
    return parseModel(res.data.data, Product);
  },

  async updateProduct(id: string, data: any): Promise<Product> {
    const res = await ProductAPI.updateProduct(id, data);
    return parseModel(res.data.data, Product);
  },

  async deleteProduct(id: string): Promise<void> {
    await ProductAPI.deleteProduct(id);
  },

  async switchProductActive(id: string): Promise<Product> {
    const res = await ProductAPI.switchProductActive(id);
    return parseModel(res.data.data, Product);
  },

  // Prices
  async listPrices(params?: any): Promise<{ items: ProductPrice[], total: number }> {
    const res = await ProductAPI.listPrices(params);
    return {
      items: parseModels(res.data.data, ProductPrice),
      total: res.data.meta.total
    };
  },

  async createPrice(data: any): Promise<ProductPrice> {
    const res = await ProductAPI.createPrice(data);
    return parseModel(res.data.data, ProductPrice);
  },

  async updatePrice(id: string, data: any): Promise<ProductPrice> {
    const res = await ProductAPI.updatePrice(id, data);
    return parseModel(res.data.data, ProductPrice);
  },

  async deletePrice(id: string): Promise<void> {
    await ProductAPI.deletePrice(id);
  },

  async switchPriceActive(id: string): Promise<ProductPrice> {
    const res = await ProductAPI.switchPriceActive(id);
    return parseModel(res.data.data, ProductPrice);
  }
};
