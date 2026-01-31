import { accessMiddleware } from "@/middleware/access.middleware";
import { FastifyInstance } from "fastify/fastify";
import { productController } from "@/http/admin/product/product.controller";
import { productPriceController } from "@/http/admin/product-price/product-price.controller";
import { couponController } from "@/http/admin/coupon/coupon.controller";
import { Role } from "@prisma/client";
import { userController } from "@/http/admin/user/user.controller";

export async function adminRoutes(server: FastifyInstance) {
    server.addHook('preHandler', (req, reply) => accessMiddleware(req, reply, [Role.ADMIN]));
    server.register(userController, { prefix: "/users" });
    server.register(productController, { prefix: "/products" });
    server.register(productPriceController, { prefix: "/product-prices" });
    server.register(couponController, { prefix: "/coupons" });
};
