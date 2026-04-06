import { AbstractService } from "@/domain/shared/abstract.service";
import { PaginationType } from "@/interfaces/http/schemas/pagination";
import { Prisma } from "@prisma/client";
import { stripeProvider } from "@/infrastructure/payment/providers";

export class CouponService extends AbstractService {
  findAll(pagination: PaginationType) {
    const { search, page, perPage } = pagination;

    let where: Prisma.CouponWhereInput = {};

    if (search) {
      where = {
        ...where,
        OR: [
          { code: { contains: search, mode: 'insensitive' } },
        ]
      }
    }

    return this.prisma.coupon.paginate({ where }, { page, perPage });
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

  findByCode(code: string) {
    return this.prisma.coupon.findUniqueOrThrow({
      where: { code, active: true },
    });
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
}