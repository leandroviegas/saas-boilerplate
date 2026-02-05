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

  async updateProduct(stripeProductId: string, product: ProductType): Promise<string> {
    const updatedStripeProduct = await this.stripe.products.update(
      stripeProductId,
      {
        name: product.name,
        description: product.description,
        active: product.active,
      }
    );

    return updatedStripeProduct.id;
  }

  async switchActive(stripeProductId: string, active: boolean): Promise<string> {
    const updatedStripeProduct = await this.stripe.products.update(
      stripeProductId,
      { active }
    );

    return updatedStripeProduct.id;
  }

  async deleteProduct(stripeProductId: string): Promise<void> {
    await this.stripe.products.del(stripeProductId);
  }
}