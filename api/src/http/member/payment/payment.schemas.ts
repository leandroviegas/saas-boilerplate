import { t } from "elysia";

export const CreateCheckoutSessionBodySchema = t.Object({
  productPriceId: t.String(),
  promotionCode: t.Optional(t.String()),
});

export type CreateCheckoutSessionBodyType = typeof CreateCheckoutSessionBodySchema.static;
