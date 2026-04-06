import { ProductType } from "@/domain/payment/payment-provider.interface";
import { StripeAbstractService } from "./stripe-abstract.service";


export class StripeProductService extends StripeAbstractService {

  async createProduct(product: ProductType): Promise<string> {
    const { stripe } = await this.getStripe();

    const stripeProduct = await stripe.products.create({
      name: product.name,
      description: product.description,
      metadata: {
        productId: product.id,
      },
    });

    return stripeProduct.id;
  }

  async updateProduct(stripeProductId: string, product: ProductType): Promise<string> {
    const { stripe } = await this.getStripe();

    const updatedStripeProduct = await stripe.products.update(
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
    const { stripe } = await this.getStripe();

    const updatedStripeProduct = await stripe.products.update(
      stripeProductId,
      { active }
    );

    return updatedStripeProduct.id;
  }

  async deleteProduct(stripeProductId: string): Promise<void> {
    const { stripe } = await this.getStripe();

    await stripe.products.del(stripeProductId);
  }
}