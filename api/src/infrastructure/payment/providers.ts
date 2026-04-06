import { transactionContext } from "@/infrastructure/database/prisma/client";
import { StripeProvider } from "./stripe.provider";


export const stripeProvider = new StripeProvider(transactionContext);
