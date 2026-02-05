import { ProductPriceType } from "../payment-provider.interface";
import { StripeAbstractService } from "./stripe-abstract.service";

export class StripePriceService extends StripeAbstractService {
  async createProductPrice(productId: string, price: ProductPriceType): Promise<string> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    let stripeProductId = product.stripeProductId;

    if (!stripeProductId) {
      const stripeProduct = await this.stripe.products.create({
        name: product.name,
        description: product.description || undefined,
        metadata: {
          productId: product.id,
        },
      });

      stripeProductId = stripeProduct.id;

      await this.prisma.product.update({
        where: { id: productId },
        data: { stripeProductId },
      });
    }

    const stripePrice = await this.stripe.prices.create({
      product: stripeProductId,
      unit_amount: Math.round(price.amount * 100),
      currency: price.currency,
      recurring: {
        interval: price.intervalType.toLowerCase() as any,
        interval_count: price.intervalValue,
      },
      metadata: {
        productPriceId: price.id
      },
    });

    return stripePrice.id;
  }

  async updateProductPrice(stripePriceId: string, price: ProductPriceType): Promise<string> {
    const stripePrice = await this.stripe.prices.update(
      stripePriceId,
      {
        active: price.active,
        currency_options: {
          [price.currency.toLowerCase()]: {
            unit_amount: Math.round(price.amount * 100),
          },
        },
        metadata: {
          productPriceId: price.id
        },
      }
    );

    return stripePrice.id;
  }

  async switchProductPriceActive(stripePriceId: string, active: boolean): Promise<void> {
    await this.stripe.prices.update(stripePriceId, { active });
  }

  async deleteProductPrice(stripePriceId: string): Promise<void> {
    throw new Error("cannot-delete-product-price-from-stripe");
  }
}