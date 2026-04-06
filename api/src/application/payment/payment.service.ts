import { AbstractService } from "@/domain/shared/abstract.service";
import { PaymentProvider } from "@/domain/payment/payment-provider.interface";
import { stripeProvider } from "@/infrastructure/payment/providers";
import { PrismaTransactionContext } from "@/infrastructure/database/prisma/transaction-context";
import { PaginationType } from "@/interfaces/http/schemas/pagination";
import { CreateCheckoutSessionResponseType } from "@/interfaces/http/controllers/member/payment.controller";
import { SystemVariableService } from "@/application/shared/system-variable.service";

export class PaymentService extends AbstractService {
  private provider: PaymentProvider;
  private systemVariableService: SystemVariableService;

  constructor(transaction: PrismaTransactionContext, provider: PaymentProvider = stripeProvider) {
    super(transaction);
    this.provider = provider;
    this.systemVariableService = new SystemVariableService(transaction);
  }

  async getTransactions(userId: string, pagination: PaginationType) {
    const { page, perPage } = pagination;

    return await this.prisma.transaction.paginate({ where: { userId }, orderBy: { createdAt: 'desc' } }, { page, perPage });
  }

  async createCheckoutSession(userId: string, organizationId: string, data: CreateCheckoutSessionResponseType) {
    const stripeConfig = await this.systemVariableService.getStripeConfig();

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

}