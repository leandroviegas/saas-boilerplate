export type DiscountType = "PERCENTAGE" | "FIXED";

export interface CouponDTO {
  id: string;
  code: string;
  value: number;
  expiresAt?: string | null;
  usageLimit?: number | null;
  usageCount: number;
  active: boolean;
  discountType: DiscountType;
  createdAt: string;
  updatedAt: string;
}

export class Coupon {
  id: string;
  code: string;
  value: number;
  expiresAt?: Date | null;
  usageLimit?: number | null;
  usageCount: number;
  active: boolean;
  discountType: DiscountType;
  createdAt: Date;
  updatedAt: Date;

  constructor(dto: CouponDTO) {
    this.id = dto.id;
    this.code = dto.code;
    this.value = dto.value;
    this.expiresAt = dto.expiresAt ? new Date(dto.expiresAt) : null;
    this.usageLimit = dto.usageLimit;
    this.usageCount = dto.usageCount;
    this.active = dto.active;
    this.discountType = dto.discountType;
    this.createdAt = new Date(dto.createdAt);
    this.updatedAt = new Date(dto.updatedAt);
  }

  get isExpired(): boolean {
    return !!this.expiresAt && this.expiresAt < new Date();
  }

  get isUsageLimitReached(): boolean {
    return !!this.usageLimit && this.usageCount >= this.usageLimit;
  }
}
