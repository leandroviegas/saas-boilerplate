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

        await stripeProvider.createProductPrice(data.productId, {
            id: productPrice.id,
            amount: productPrice.amount,
            currency: productPrice.currency,
            active: productPrice.active,
            intervalValue: productPrice.intervalValue,
            intervalType: productPrice.intervalType
        });

        return productPrice;
    }

    async delete(id: string) {
        return this.prisma.productPrice.delete({
            where: { id },
        }).then(async productPrice => {
            await stripeProvider.deleteProductPrice(productPrice.id);
            return productPrice;
        });
    }

    async update(id: string, data: UpdateProductPriceBodyType) {
        let productPrice = await this.prisma.productPrice.findFirstOrThrow({
            where: { id, stripePriceId: { not: null } },
        });

        productPrice = await this.prisma.productPrice.update({
            where: { id },
            data
        })

        await stripeProvider.updateProductPrice(productPrice.id, {
            id: productPrice.id,
            amount: productPrice.amount,
            currency: productPrice.currency,
            active: productPrice.active,
            intervalValue: productPrice.intervalValue,
            intervalType: productPrice.intervalType
        });

        return productPrice;
    }

    async switchActive(id: string) {
        return this.findById(id).then(async productPrice => {
            await this.prisma.productPrice.update({
                where: { id },
                data: { active: !productPrice.active },
            });


            await stripeProvider.updateProductPrice(productPrice.id, {
                id: productPrice.id,
                amount: productPrice.amount,
                currency: productPrice.currency,
                active: !productPrice.active,
                intervalValue: productPrice.intervalValue,
                intervalType: productPrice.intervalType
            });

            return productPrice;
        })
    }
}