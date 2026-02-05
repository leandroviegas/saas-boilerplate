import { CreateCheckoutSessionOptions, PaymentProvider, ProductType, ProductPriceType, CouponType } from "./payment-provider.interface";
import { ExtendedPrismaClient } from "@/plugins/prisma";
import { StripeProductService } from "./stripe/stripe-product.service";
import { StripePriceService } from "./stripe/stripe-price.service";
import { StripeCheckoutService } from "./stripe/stripe-checkout.service";
import { StripeWebhookService } from "./stripe/stripe-webhook.service";
import { StripeCouponService } from "./stripe/stripe-coupon.service";

export class StripeProvider implements PaymentProvider {
  private prisma: ExtendedPrismaClient;
  private productService: StripeProductService;
  private priceService: StripePriceService;
  private checkoutService: StripeCheckoutService;
  private webhookService: StripeWebhookService;
  private couponService: StripeCouponService;

  constructor(prisma: ExtendedPrismaClient) {
    this.prisma = prisma;
    this.productService = new StripeProductService(this.prisma);
    this.priceService = new StripePriceService(this.prisma);
    this.checkoutService = new StripeCheckoutService(this.prisma);
    this.webhookService = new StripeWebhookService(this.prisma);
    this.couponService = new StripeCouponService(this.prisma);
  }

  async createCheckoutSession(options: CreateCheckoutSessionOptions) {
    return this.checkoutService.createCheckoutSession(options);
  }

  async handleWebhook(payload: any, signature: string) {
    return this.webhookService.handleWebhook(payload, signature);
  }

  async cancelSubscription(subscriptionId: string) {
    return this.checkoutService.cancelSubscription(subscriptionId);
  }

  async createProduct(product: ProductType): Promise<string> {
    return this.productService.createProduct(product);
  }

  async updateProduct(productId: string, product: ProductType): Promise<string> {
    return this.productService.updateProduct(productId, product);
  }

  async deleteProduct(productId: string): Promise<void> {
    return this.productService.deleteProduct(productId);
  }

  async switchActive(productId: string, active: boolean): Promise<string> {
    return this.productService.switchActive(productId, active);
  }


  async createProductPrice(productId: string, price: ProductPriceType): Promise<string> {
    return this.priceService.createProductPrice(productId, price);
  }

  async switchProductPriceActive(stripePriceId: string, active: boolean) {
    return this.priceService.switchProductPriceActive(stripePriceId, active);
  }

  async updateProductPrice(stripePriceId: string, price: ProductPriceType): Promise<string> {
    return this.priceService.updateProductPrice(stripePriceId, price);
  }

  async deleteProductPrice(stripePriceId: string): Promise<void> {
    return this.priceService.deleteProductPrice(stripePriceId);
  }

  async createCoupon(coupon: CouponType): Promise<string> {
    return this.couponService.createCoupon(coupon);
  }

  async updateCoupon(couponId: string, coupon: CouponType): Promise<string> {
    return this.couponService.updateCoupon(couponId, coupon);
  }

  async deleteCoupon(couponId: string): Promise<void> {
    return this.couponService.deleteCoupon(couponId);
  }
}