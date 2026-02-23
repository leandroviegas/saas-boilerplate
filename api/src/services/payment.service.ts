import { AbstractService } from "@/services/abstract.service";
import { PaymentProvider } from "./payment/payment-provider.interface";
import { stripeProvider } from "./payment/providers";
import { ExtendedPrismaClient } from "@/plugins/prisma";
import { CreateCheckoutSessionBodyType } from "@/http/member/payment/payment.schemas";
import { PaginationType } from "@/schemas/pagination";
import { stripeConfig } from "@/config";

export class PaymentService extends AbstractService {
  private provider: PaymentProvider;

  constructor(prisma: ExtendedPrismaClient, provider: PaymentProvider = stripeProvider) {
    super(prisma);
    this.provider = provider;
  }

  async createCheckoutSession(userId: string, organizationId: string, data: CreateCheckoutSessionBodyType) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });

    const productPrice = await this.prisma.productPrice.findFirstOrThrow({
      where: { id: data.productPriceId, stripePriceId: { not: null } },
      include: { product: true },
    });

    return await this.provider.createCheckoutSession({
      userId,
      organizationId,
      email: user.email,
      priceId: productPrice.stripePriceId!,
      successUrl: stripeConfig.successUrl,
      cancelUrl: stripeConfig.cancelUrl,
      promotionCode: data.promotionCode,
    });
  }

  async handleWebhook(payload: any, signature: string) {
    return await this.provider.handleWebhook(payload, signature);
  }

  async cancelSubscription(organizationId: string) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { organizationId, status: "ACTIVE" },
    });

    if (!subscription || !subscription.stripeSubscriptionId) {
      throw new Error("no active subscription found");
    }

    return await this.provider.cancelSubscription(subscription.stripeSubscriptionId);
  }

  async getSubscription(organizationId: string) {
    return await this.prisma.subscription.findFirstOrThrow({
      where: { organizationId },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async getTransactions(userId: string, pagination: PaginationType) {
    return await this.prisma.transaction.paginate({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }, pagination);
  }

}