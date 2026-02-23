import { prisma } from "@/plugins/prisma";

import { AuthService } from "./auth.service";
import { EmailService } from "./email.service";
import { NotificationService } from "./notification.service";
import { OrganizationRolePermissionService } from "./organization-role-permission.service";
import { PaymentService } from "./payment.service";
import { ProductPriceService } from "./product-prices.service";
import { ProductService } from "./product.service";
import { CouponService } from "./coupon.service";
import { S3Service } from "./s3.service";
import { SessionService } from "./session.service";
import { UserService } from "./user.service";
import { WebsocketsService } from "./websockets.service";

export const authService = new AuthService(prisma);
export const emailService = new EmailService(prisma);
export const notificationService = new NotificationService(prisma);
export const organizationRolePermissionService = new OrganizationRolePermissionService(prisma);
export const paymentService = new PaymentService(prisma);
export const productPriceService = new ProductPriceService(prisma);
export const productService = new ProductService(prisma);
export const couponService = new CouponService(prisma);
export const s3Service = new S3Service();
export const sessionService = new SessionService(prisma);
export const userService = new UserService(prisma);
export const websocketsService = new WebsocketsService();