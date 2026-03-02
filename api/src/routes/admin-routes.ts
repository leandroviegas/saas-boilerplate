import { FastifyInstance } from "fastify/fastify";
import { couponController } from "@/http/admin/coupon/coupon.controller";
import { productController } from "@/http/admin/product/product.controller";
import { productPriceController } from "@/http/admin/product-price/product-price.controller";
import { roleController } from "@/http/admin/role/role.controller";
import { rolePermissionController } from "@/http/admin/role-permission/role-permission.controller";
import { userController } from "@/http/admin/user/user.controller";

export async function adminRoutes(server: FastifyInstance) {
    server.register(couponController, { prefix: "/coupons" });
    server.register(productController, { prefix: "/products" });
    server.register(productPriceController, { prefix: "/product-prices" });
    server.register(roleController, { prefix: "/roles" });
    server.register(rolePermissionController, { prefix: "/role-permissions" });
    server.register(userController, { prefix: "/users" });
};
