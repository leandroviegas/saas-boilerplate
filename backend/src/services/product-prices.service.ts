import { AbstractService } from "@/services/abstract.service";
import { CreateProductPriceBodyType, UpdateProductPriceBodyType } from "@/http/admin/product-price/product-price.schemas";
import { PaginationType } from "@/schemas/pagination";
import { stripeProvider } from "./payment/providers";

export class ProductPriceService extends AbstractService {
    findAllByProductId(productId: string) {
        return this.prisma.productPrice.findMany({
            where: { productId },
        });
    }

    async findAll(query: { productId?: string } & PaginationType) {
        return await this.prisma.productPrice.paginate({
            where: {
                ...(query.productId && { productId: query.productId }),
                active: true,
                archived: false
            },
        }, query);
    }

    async findById(id: string) {
        return await this.prisma.productPrice.findUniqueOrThrow({
            where: { id }
        });
    }

    async create(data: CreateProductPriceBodyType) {
        const productPrice = await this.prisma.productPrice.create({
            data,
        });

        const stripePriceId = await stripeProvider.createProductPrice(data.productId, {
            id: productPrice.id,
            amount: productPrice.amount,
            currency: productPrice.currency,
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

    async update(id: string, data: UpdateProductPriceBodyType) {
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
                currency: productPrice.currency,
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