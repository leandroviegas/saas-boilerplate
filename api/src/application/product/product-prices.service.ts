import { AbstractService } from "@/domain/shared/abstract.service";
import { PaginationType } from "@/interfaces/http/schemas/pagination";
import { stripeProvider } from "@/infrastructure/payment/providers";
import { CreateProductPriceType, UpdateProductPriceType } from "@/interfaces/http/schemas/models/product.schema";

export class ProductPriceService extends AbstractService {
    async findAll(query: { productId?: string } & PaginationType) {
        const { productId, page, perPage } = query;

        const where = {
            ...(productId && { productId }),
            active: true,
            archived: false
        };

        return await this.prisma.productPrice.paginate({ where }, { page, perPage });
    }

    async findById(id: string) {
        return await this.prisma.productPrice.findUniqueOrThrow({
            where: { id }
        });
    }

    async create(data: CreateProductPriceType) {
        const productPrice = await this.prisma.productPrice.create({
            data,
        });

        const stripePriceId = await stripeProvider.createProductPrice(data.productId, {
            id: productPrice.id,
            amount: productPrice.amount,
            currency: productPrice.currencyCode,
            active: productPrice.active,
            intervalValue: productPrice.intervalValue,
            intervalType: productPrice.intervalType
        });

        return await this.prisma.productPrice.update({
            where: { id: productPrice.id },
            data: { stripePriceId },
        });
    }

    async delete(id: string) {
        let productPrice = await this.prisma.productPrice.findFirstOrThrow({
            where: { id },
        })

        if (productPrice.stripePriceId) {
            await stripeProvider.deleteProductPrice(productPrice.stripePriceId);
        }

        await this.prisma.productPrice.delete({
            where: { id },
        });

        return productPrice;
    }

    async update(id: string, data: UpdateProductPriceType) {
        let productPrice = await this.prisma.productPrice.findFirstOrThrow({
            where: { id },
        });

        productPrice = await this.prisma.productPrice.update({
            where: { id },
            data
        })

        if (productPrice.stripePriceId) {
            await stripeProvider.updateProductPrice(productPrice.stripePriceId, {
                id: productPrice.id,
                amount: productPrice.amount,
                currency: productPrice.currencyCode,
                active: productPrice.active,
                intervalValue: productPrice.intervalValue,
                intervalType: productPrice.intervalType
            });
        }

        return productPrice;
    }

    async switchActive(id: string) {
        const prevProductPrice = await this.prisma.productPrice.findFirstOrThrow({
            where: { id },
            select: { active: true, stripePriceId: true }
        });

        const newActive = !prevProductPrice.active;

        if (prevProductPrice.stripePriceId) {
            await stripeProvider.switchProductPriceActive(prevProductPrice.stripePriceId, newActive);
        }

        const productPrice = await this.prisma.productPrice.update({
            where: { id },
            data: { active: newActive },
        });


        return productPrice;
    }
}