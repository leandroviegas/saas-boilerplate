import Stripe from "stripe";
import { stripeConfig } from "@/config";
import { PrismaTransactionContext } from "@/plugins/prisma-transaction-context";
import { AbstractService } from "@/services/abstract.service";


export abstract class StripeAbstractService extends AbstractService {
  protected stripe: Stripe;
  constructor(transaction: PrismaTransactionContext) {
    super(transaction);
    this.stripe = new Stripe(stripeConfig.apiKey, {
      apiVersion: "2026-02-25.clover",
    });
  }
}
