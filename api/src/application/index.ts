import { transactionContext } from "@/infrastructure/database/prisma/client";

import { AuthService } from "./auth/auth.service";
import { CouponService } from "./coupon/coupon.service";
import { EmailService } from "./shared/email.service";
import { NotificationService } from "./notification/notification.service";
import { OrganizationRolePermissionService } from "./organization/organization-role-permission.service";
import { OrganizationService } from "./organization/organization.service";
import { PaymentService } from "./payment/payment.service";
import { ProductPriceService } from "./product/product-prices.service";
import { ProductService } from "./product/product.service";
import { RoleService } from "./shared/role.service";
import { S3Service } from "./shared/s3.service";
import { SessionService } from "./auth/session.service";
import { UserService } from "./user/user.service";
import { WebsocketsService } from "./shared/websockets.service";
import { SystemVariableService } from "@/application/shared/system-variable.service";

export { transactionContext };

export const authService = new AuthService(transactionContext);
export const systemVariableService = new SystemVariableService(transactionContext);
export const couponService = new CouponService(transactionContext);
export const emailService = new EmailService(transactionContext);
export const notificationService = new NotificationService(transactionContext);
export const organizationRolePermissionService = new OrganizationRolePermissionService(transactionContext);
export const organizationService = new OrganizationService(transactionContext);
export const paymentService = new PaymentService(transactionContext);
export const productPriceService = new ProductPriceService(transactionContext);
export const productService = new ProductService(transactionContext);
export const roleService = new RoleService(transactionContext);
export const s3Service = new S3Service(transactionContext);
export const sessionService = new SessionService(transactionContext);
export const userService = new UserService(transactionContext);
export const websocketsService = new WebsocketsService();
