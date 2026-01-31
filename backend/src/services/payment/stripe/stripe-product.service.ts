import { ProductType } from "../payment-provider.interface";
import { StripeAbstractService } from "./stripe-abstract.service";

export class StripeProductService extends StripeAbstractService {

  async createProduct(product: ProductType): Promise<string> {
    const stripeProduct = await this.stripe.products.create({
      name: product.name,
      description: product.description,
      metadata: {
        productId: product.id,
      },
    });

    return stripeProduct.id;
  }

  async updateProduct(productId: string, product: ProductType): Promise<string> {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      throw new Error("Product not found");
    }

    let stripeProductId = existingProduct.stripeProductId;

    if (!stripeProductId) {
      const stripeProduct = await this.stripe.products.create({
        name: product.name,
        description: product.description,
        metadata: {
          productId: product.id,
        },
      });
      stripeProductId = stripeProduct.id;
    }

    const updatedStripeProduct = await this.stripe.products.update(
      stripeProductId,
      {
        name: product.name,
        description: product.description,
        active: product.active,
      }
    );

    await this.prisma.product.update({
      where: { id: productId },
      data: { stripeProductId: stripeProductId },
    });

    return updatedStripeProduct.id;
  }

  async deleteProduct(stripeProductId: string): Promise<void> {

      await this.stripe.products.del(stripeProductId);
  }
}