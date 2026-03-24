import { transactionContext } from "@/plugins/prisma";
import { StripeProvider } from "./stripe.provider";


export const stripeProvider = new StripeProvider(transactionContext);
