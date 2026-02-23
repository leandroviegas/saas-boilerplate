import Stripe from "stripe";
import { stripeConfig } from "@/config";
import { StripeAbstractService } from "./stripe-abstract.service";

export class StripeWebhookService extends StripeAbstractService {

  async handleWebhook(payload: any, signature: string) {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        stripeConfig.webhookSecret
      );
    } catch (err: any) {
      throw new Error(`webhook error: ${err.message}`);
    }

    switch (event.type) {
      case "checkout.session.completed":
        await this.handleCheckoutSessionCompleted(event.data.object);
        break;
      case "invoice.payment_succeeded":
        await this.handleInvoicePaymentSucceeded(event.data.object);
        break;
      case "customer.subscription.deleted":
        await this.handleSubscriptionDeleted(event.data.object);
        break;
      case "customer.subscription.updated":
        await this.handleSubscriptionUpdated(event.data.object);
        break;
    }
  }

  private async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    const organizationId = session.metadata?.organizationId;
    const stripeSubscriptionId =
      typeof session.subscription === 'string'
        ? session.subscription
        : session.subscription?.id;

    if (!organizationId || !stripeSubscriptionId) return;

    const stripeSubscription = await this.stripe.subscriptions.retrieve(stripeSubscriptionId);
    const subscriptionItem = stripeSubscription.items.data[0];
    const priceId = subscriptionItem.price.id;

    const productPrice = await this.prisma.productPrice.findUnique({
      where: { stripePriceId: priceId },
      include: { product: true },
    });

    if (!productPrice) return;

    await this.prisma.subscription.upsert({
      where: { stripeSubscriptionId },
      create: {
        organizationId,
        productId: productPrice.productId,
        stripeSubscriptionId,
        status: "ACTIVE",
        currentPeriodStart: new Date(subscriptionItem.current_period_start * 1000),
        currentPeriodEnd: new Date(subscriptionItem.current_period_end * 1000),
      },
      update: {
        status: "ACTIVE",
        currentPeriodStart: new Date(subscriptionItem.current_period_start * 1000),
        currentPeriodEnd: new Date(subscriptionItem.current_period_end * 1000),
      },
    });
  }

  private async handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
    const sub = invoice.lines.data[0].subscription;
    const stripeSubscriptionId = typeof sub === 'string' ? sub : sub?.id;
    let userId = invoice.lines.data[0].metadata?.userId;

    if (!stripeSubscriptionId)
      throw new Error("subscription not found");

    let paymentIntentId;

    if (invoice.total > 0) {
      const invoicePayments = await this.stripe.invoicePayments.list({
        invoice: invoice.id,
        limit: 1,
      });

      const paymentIntent = invoicePayments.data[0]?.payment.payment_intent;

      if (!paymentIntent)
        throw new Error("payment intent not found");

      paymentIntentId = typeof paymentIntent == "string" ? paymentIntent : paymentIntent.id;
    }

    const subscription = await this.prisma.subscription.findUnique({
      where: { stripeSubscriptionId },
      include: {
        organization: {
          include: {
            members: {
              where: {
                role: "owner"
              }
            }
          },
        }
      }
    });

    if (!subscription) return;

    userId = userId ?? subscription.organization.members[0].userId;

    const stripeSubscription = await this.stripe.subscriptions.retrieve(stripeSubscriptionId);
    const subscriptionItem = stripeSubscription.items.data[0];

    await this.prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: "ACTIVE",
        currentPeriodStart: new Date(subscriptionItem.current_period_start * 1000),
        currentPeriodEnd: new Date(subscriptionItem.current_period_end * 1000),
      },
    });

    await this.prisma.currency.upsert({
      where: { code: invoice.currency.toLocaleUpperCase() },
      create: {
        code: invoice.currency.toLocaleUpperCase(),
        name: invoice.currency.toLocaleUpperCase(),
      },
      update: {},
    });

    await this.prisma.transaction.create({
      data: {
        userId,
        amount: invoice.amount_paid / 100,
        currencyCode: invoice.currency,
        status: "SUCCEEDED",
        stripePaymentIntentId: paymentIntentId,
      },
    });
  }

  private async handleSubscriptionDeleted(stripeSubscription: Stripe.Subscription) {
    await this.prisma.subscription.update({
      where: { stripeSubscriptionId: stripeSubscription.id },
      data: {
        status: "CANCELED",
      },
    });
  }

  private async handleSubscriptionUpdated(stripeSubscription: Stripe.Subscription) {
    const subscriptionItem = stripeSubscription.items.data[0];
    await this.prisma.subscription.update({
      where: { stripeSubscriptionId: stripeSubscription.id },
      data: {
        status: stripeSubscription.status.toUpperCase() as any,
        currentPeriodStart: new Date(subscriptionItem.current_period_start * 1000),
        currentPeriodEnd: new Date(subscriptionItem.current_period_end * 1000),
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
      },
    });
  }
}