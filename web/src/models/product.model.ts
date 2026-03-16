export type PriceInterval = "DAY" | "WEEK" | "MONTH" | "YEAR";

export interface ProductPriceType {
  id: string;
  productId: string;
  intervalValue: number;
  amount: number;
  active: boolean;
  currencyCode: string;
  intervalType: PriceInterval;
  createdAt: string;
  updatedAt: string;
}

export interface ProductType {
  id: string;
  name: string;
  description?: string | null;
  features: string[];
  permissions: any;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  prices?: ProductPriceType[];
}

export class ProductPriceDTO {
  id: string;
  productId: string;
  intervalValue: number;
  amount: number;
  active: boolean;
  currencyCode: string;
  intervalType: PriceInterval;
  createdAt: Date;
  updatedAt: Date;

  constructor(dto: ProductPriceType) {
    this.id = dto.id;
    this.productId = dto.productId;
    this.intervalValue = dto.intervalValue;
    this.amount = dto.amount;
    this.active = dto.active;
    this.currencyCode = dto.currencyCode;
    this.intervalType = dto.intervalType;
    this.createdAt = new Date(dto.createdAt);
    this.updatedAt = new Date(dto.updatedAt);
  }
}

export class ProductDTO {
  id: string;
  name: string;
  description?: string | null;
  features: string[];
  permissions: any;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  prices: ProductPriceDTO[];

  constructor(dto: ProductType) {
    this.id = dto.id;
    this.name = dto.name;
    this.description = dto.description;
    this.features = dto.features;
    this.permissions = dto.permissions;
    this.active = dto.active;
    this.createdAt = new Date(dto.createdAt);
    this.updatedAt = new Date(dto.updatedAt);
    this.prices = dto.prices ? dto.prices.map(p => new ProductPriceDTO(p)) : [];
  }
}
