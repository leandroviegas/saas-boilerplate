import { AbstractService } from "@/services/abstract.service";
import { PaginationType } from "@/schemas/pagination";
import { stripeProvider } from "@/services/payment/providers";
import { Prisma } from "@prisma/client";

export class ProductService extends AbstractService {
  findAll(pagination: PaginationType) {
    return this.prisma.product.paginate({}, pagination);
  }

  findById(id: string) {
    return this.prisma.product.findUniqueOrThrow({
      where: { id },
      include: {
        prices: true
      },
    });
  }

  async create(data: Prisma.ProductCreateInput) {
    const product = await this.prisma.product.create({ data });

    const stripeProductId = await stripeProvider.createProduct({
      id: product.id,
      name: product.name,
      description: product.description || undefined,
      features: product.features,
      active: product.active,
    });

    return await this.prisma.product.update({
      where: { id: product.id },
      data: { stripeProductId },
    });
  }

  async update(id: string, data: Prisma.ProductUpdateInput) {
    const product = await this.prisma.product.update({
      where: { id },
      data
    });

    if (product.stripeProductId) {
      await stripeProvider.updateProduct(product.stripeProductId, {
        id: product.id,
        name: product.name,
        description: product.description || undefined,
        features: product.features,
        active: product.active,
      });
    }
    return product;
  }

  async delete(id: string) {
    const product = await this.prisma.product.findFirstOrThrow({ where: { id } });

    if (product.stripeProductId) {
      await stripeProvider.deleteProduct(product.stripeProductId);
    }

    await this.prisma.product.delete({ where: { id } });

    return product;
  }

  async switchActive(id: string) {
    const prevProduct = await this.prisma.product.findFirstOrThrow({
      where: { id },
      select: { active: true, stripeProductId: true }
    });
    const newActive = !prevProduct.active;

    if (prevProduct.stripeProductId) {
      await stripeProvider.switchActive(prevProduct.stripeProductId, newActive);
    }

    const product = await this.prisma.product.update({
      where: { id },
      data: { active: newActive },
    });

    return product;
  }
}