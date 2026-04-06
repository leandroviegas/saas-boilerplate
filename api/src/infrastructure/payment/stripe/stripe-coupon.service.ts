import Stripe from "stripe";
import { CouponType } from "@/domain/payment/payment-provider.interface";
import { StripeAbstractService } from "./stripe-abstract.service";


export class StripeCouponService extends StripeAbstractService {
  async createCoupon(coupon: CouponType): Promise<string> {
    const { stripe } = await this.getStripe();

    const stripeCouponData: Stripe.CouponCreateParams = {
      id: coupon.code,
      name: coupon.code,
      max_redemptions: coupon.usageLimit || undefined,
      redeem_by: coupon.expiresAt ? Math.floor(new Date(coupon.expiresAt).getTime() / 1000) : undefined,
      metadata: {
        couponId: coupon.id,
      },
    };

    if (coupon.discountType === "PERCENTAGE") {
      stripeCouponData.percent_off = coupon.value;
    } else {
      stripeCouponData.amount_off = Math.round(coupon.value * 100);
      stripeCouponData.currency = "usd";
    }

    const stripeCoupon = await stripe.coupons.create(stripeCouponData);

    return stripeCoupon.id;
  }

  async updateCoupon(couponId: string, coupon: CouponType): Promise<string> {
    const { stripe } = await this.getStripe();

    const updatedCoupon = await stripe.coupons.update(couponId, {
      name: coupon.code,
      metadata: {
        couponId: coupon.id,
      },
    });

    return updatedCoupon.id;
  }

  async deleteCoupon(couponId: string): Promise<void> {
    const { stripe } = await this.getStripe();

    await stripe.coupons.del(couponId);
  }
}