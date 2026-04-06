import Stripe from "stripe";
import { PrismaTransactionContext } from "@/infrastructure/database/prisma/transaction-context";
import { AbstractService } from "@/domain/shared/abstract.service";
import { SystemVariableService } from "@/application/shared/system-variable.service";


export abstract class StripeAbstractService extends AbstractService {
  systemVariableService!: SystemVariableService;

  constructor(transaction: PrismaTransactionContext) {
    super(transaction);
    this.systemVariableService = new SystemVariableService(transaction);
  }

  async getStripe() {
    const { apiKey } = await this.systemVariableService.getStripeConfig();
    
    const stripe = new Stripe(apiKey || "", {
      apiVersion: "2026-02-25.clover",
    });

    return { stripe };
  }
}