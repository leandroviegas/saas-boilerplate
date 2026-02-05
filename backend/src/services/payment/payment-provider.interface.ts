export interface CreateCheckoutSessionOptions {
  userId: string;
  email: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  promotionCode?: string;
  metadata?: Record<string, string>;
}

export interface CheckoutSession {
  id: string;
  url: string | null;
}

export interface ProductType {
  id: string;
  name: string;
  description?: string;
  features: string[];
  active: boolean;
}

export interface ProductPriceType {
  id: string;
  productId?: string;
  amount: number;
  currency: string;
  stripePriceId?: string;
  active: boolean;
  intervalType: string;
  intervalValue: number;
}

export interface CouponType {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  value: number;
  expiresAt?: string;
  usageLimit?: number;
  active: boolean;
}

export interface PaymentProvider {
  createCheckoutSession(options: CreateCheckoutSessionOptions): Promise<CheckoutSession>;
  handleWebhook(payload: any, signature: string): Promise<void>;
  cancelSubscription(subscriptionId: string): Promise<void>;
  createProduct(product: ProductType): Promise<string>;
  updateProduct(productId: string, product: ProductType): Promise<string>;
  deleteProduct(productId: string): Promise<void>;
  createProductPrice(productId: string, price: ProductPriceType): Promise<string>;
  updateProductPrice(priceId: string, price: ProductPriceType): Promise<string>;
  deleteProductPrice(priceId: string): Promise<void>;
  createCoupon(coupon: CouponType): Promise<string>;
  updateCoupon(couponId: string, coupon: CouponType): Promise<string>;
  deleteCoupon(couponId: string): Promise<void>;
}
