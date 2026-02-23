import { prisma } from "@/plugins/prisma";
import { StripeProvider } from "./stripe.provider";


export const stripeProvider = new StripeProvider(prisma);
