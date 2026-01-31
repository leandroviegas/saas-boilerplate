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
        data: { stripeProductId: stripeProductId },
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
        productPriceId: price.id || "",
      },
    });

    return stripePrice.id;
  }

  async updateProductPrice(priceId: string, price: ProductPriceType): Promise<string> {
    const existingPrice = await this.prisma.productPrice.findUnique({
      where: { id: priceId },
    });

    if (!existingPrice) {
      throw new Error("Price not found");
    }

    if (!existingPrice.stripePriceId) {
      throw new Error("Price not found in Stripe");
    }

    const stripePrice = await this.stripe.prices.update(
      existingPrice.stripePriceId,
      {
        active: price.active,
        currency_options: {
          [price.currency.toLowerCase()]: {
            unit_amount: Math.round(price.amount * 100),
          },
        },
        metadata: {
          productPriceId: price.id || "",
        },
      }
    );

    return stripePrice.id;
  }

  async deleteProductPrice(stripePriceId: string): Promise<void> {
    await this.stripe.prices.update(stripePriceId, {
      active: false,
    });
  }
}