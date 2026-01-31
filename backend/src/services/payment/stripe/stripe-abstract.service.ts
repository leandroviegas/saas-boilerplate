import Stripe from "stripe";
import { stripeConfig } from "@/config";
import { ExtendedPrismaClient } from "@/plugins/prisma";
import { AbstractService } from "@/services/abstract.service";

export abstract class StripeAbstractService extends AbstractService {
  protected stripe: Stripe;
  constructor(prisma: ExtendedPrismaClient) {
    super(prisma);
    this.stripe = new Stripe(stripeConfig.apiKey, {
      apiVersion: "2025-12-15.clover",
    });
  }
}