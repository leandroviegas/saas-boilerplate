import { CreateCheckoutSessionOptions } from "../payment-provider.interface";
import { ExtendedPrismaClient } from "@/plugins/prisma";
import { StripeAbstractService } from "./stripe-abstract.service";
import { StripeCustomerService } from "./stripe-customer.service";

export class StripeCheckoutService extends StripeAbstractService {
  private customerService: StripeCustomerService;

  constructor(prisma: ExtendedPrismaClient) {
    super(prisma);
    this.customerService = new StripeCustomerService(prisma);
  }

  async createCheckoutSession(options: CreateCheckoutSessionOptions) {
    const customerId = await this.customerService.getOrCreateCustomer(options.userId, options.email);

    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: options.priceId,
          quantity: 1
        },
      ],
      mode: "subscription",
      success_url: options.successUrl,
      cancel_url: options.cancelUrl,
      metadata: {
        userId: options.userId,
        ...options.metadata,
      },
      allow_promotion_codes: true,
    });

    return {
      id: session.id,
      url: session.url ?? "",
    };
  }

  async cancelSubscription(subscriptionId: string) {
    await this.stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
  }
}