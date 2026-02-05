import { AbstractService } from "@/services/abstract.service";
import { PaginationType } from "@/schemas/pagination";
import { Prisma } from "@prisma/client";
import { stripeProvider } from "@/services/payment/providers";

export class CouponService extends AbstractService {
  findByCode(code: string) {
    return this.prisma.coupon.findUniqueOrThrow({
      where: { code, active: true },
    });
  }

  async validate(code: string) {
    const promo = await this.findByCode(code);

    if (promo.expiresAt && promo.expiresAt < new Date()) {
      throw new Error("Coupon expired");
    }

    if (promo.usageLimit && promo.usageCount >= promo.usageLimit) {
      throw new Error("Coupon usage limit reached");
    }

    return promo;
  }

  incrementUsage(code: string) {
    return this.prisma.coupon.update({
      where: { code },
      data: {
        usageCount: {
          increment: 1,
        },
      },
    });
  }

  findAll(pagination: PaginationType) {
    return this.prisma.coupon.paginate({}, pagination);
  }

  findById(id: string) {
    return this.prisma.coupon.findUniqueOrThrow({
      where: { id },
    });
  }

  async create(data: Prisma.CouponCreateInput) {
    const coupon = await this.prisma.coupon.create({ data });

    const stripeCouponId = await stripeProvider.createCoupon({
      id: coupon.id,
      code: coupon.code,
      discountType: coupon.discountType,
      value: coupon.value,
      expiresAt: coupon.expiresAt?.toISOString(),
      usageLimit: coupon.usageLimit || undefined,
      active: coupon.active,
    });

    return await this.prisma.coupon.update({
      where: { id: coupon.id },
      data: { stripeCouponId },
    });
  }

  async update(id: string, data: Prisma.CouponUpdateInput) {
    const coupon = await this.prisma.coupon.update({
      where: { id },
      data
    });

    if (coupon.stripeCouponId) {
      await stripeProvider.updateCoupon(coupon.stripeCouponId, {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        value: coupon.value,
        expiresAt: coupon.expiresAt?.toISOString(),
        usageLimit: coupon.usageLimit || undefined,
        active: coupon.active,
      });
    }
    return coupon;
  }

  async delete(id: string) {
    return await this.prisma.coupon.delete({ where: { id } }).then(async coupon => {
      if (coupon.stripeCouponId) {
        await stripeProvider.deleteCoupon(coupon.stripeCouponId);
      }
      return coupon;
    });
  }

}