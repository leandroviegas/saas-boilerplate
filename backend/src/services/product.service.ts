import { AbstractService } from "@/services/abstract.service";
import { PaginationType } from "@/schemas/pagination";
import { stripeProvider } from "@/services/payment/providers";
import { Prisma } from "@prisma/client";

export class ProductService extends AbstractService {
  findAll(pagination: PaginationType) {
    return this.prisma.product.paginate({
      where: { active: true, archived: false },
      include: {
        prices: {
          where: { active: true, archived: false },
        },
      },
    }, pagination);
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
    return await this.prisma.product.create({ data }).then(async product => {
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
    });
  }

  async update(id: string, data: Prisma.ProductUpdateInput) {
    return await this.prisma.product.update({
      where: { id },
      data
    }).then(async product => {
      await stripeProvider.updateProduct(id, {
        id: product.id,
        name: product.name,
        description: product.description || undefined,
        features: product.features,
        active: product.active,
      });
      return product;
    });
  }

  async delete(id: string) {
    return await this.prisma.product.delete({ where: { id } }).then(async product => {
      if (product.stripeProductId) {
        await stripeProvider.deleteProduct(product.stripeProductId);
      }
      return product
    });
  }

  async switchActive(id: string) {
    const currentProduct = await this.findById(id);

    const newActive = !currentProduct.active;

    return await this.prisma.product.update({
      where: { id },
      data: { active: newActive },
    }).then(async product => {
      await stripeProvider.updateProduct(id, {
        id: product.id,
        name: product.name,
        description: product.description || undefined,
        features: product.features,
        active: newActive,
      });

      return product;
    });
  }
}