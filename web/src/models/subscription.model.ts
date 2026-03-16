import { ProductDTO, ProductType } from "./product.model";

export type SubscriptionStatus = "ACTIVE" | "CANCELED" | "PAST_DUE" | "INCOMPLETE" | "TRIALING" | "INCOMPLETE_EXPIRED" | "UNPAID";

export interface SubscriptionType {
  id: string;
  organizationId: string;
  productId: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  status: SubscriptionStatus;
  createdAt: string;
  updatedAt: string;
  product?: ProductType | null;
}

export class SubscriptionDTO {
  id: string;
  organizationId: string;
  productId: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  status: SubscriptionStatus;
  createdAt: Date;
  updatedAt: Date;
  product?: ProductDTO | null;

  constructor(dto: SubscriptionType) {
    this.id = dto.id;
    this.organizationId = dto.organizationId;
    this.productId = dto.productId;
    this.currentPeriodStart = new Date(dto.currentPeriodStart);
    this.currentPeriodEnd = new Date(dto.currentPeriodEnd);
    this.cancelAtPeriodEnd = dto.cancelAtPeriodEnd;
    this.status = dto.status;
    this.createdAt = new Date(dto.createdAt);
    this.updatedAt = new Date(dto.updatedAt);
    this.product = dto.product ? new ProductDTO(dto.product) : null;
  }
}

export interface TransactionType {
  id: string;
  userId?: string | null;
  amount: number;
  status: string;
  currencyCode: string;
  paymentMethod?: string | null;
  createdAt: string;
  updatedAt: string;
}

export class TransactionDTO {
  id: string;
  userId?: string | null;
  amount: number;
  status: string;
  currencyCode: string;
  paymentMethod?: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(dto: TransactionType) {
    this.id = dto.id;
    this.userId = dto.userId;
    this.amount = dto.amount;
    this.status = dto.status;
    this.currencyCode = dto.currencyCode;
    this.paymentMethod = dto.paymentMethod;
    this.createdAt = new Date(dto.createdAt);
    this.updatedAt = new Date(dto.updatedAt);
  }
}
