import { transactionContext } from "@/plugins/prisma";

import { AuthService } from "./auth.service";
import { CouponService } from "./coupon.service";
import { EmailService } from "./email.service";
import { NotificationService } from "./notification.service";
import { OrganizationRolePermissionService } from "./organization-role-permission.service";
import { OrganizationService } from "./organization.service";
import { PaymentService } from "./payment.service";
import { ProductPriceService } from "./product-prices.service";
import { ProductService } from "./product.service";
import { RoleService } from "./role.service";
import { S3Service } from "./s3.service";
import { SessionService } from "./session.service";
import { UserService } from "./user.service";
import { WebsocketsService } from "./websockets.service";
import { SystemVariableService } from "./system-variable.service";

export { transactionContext };

export const authService = new AuthService(transactionContext);
export const couponService = new CouponService(transactionContext);
export const emailService = new EmailService(transactionContext);
export const notificationService = new NotificationService(transactionContext);
export const organizationRolePermissionService = new OrganizationRolePermissionService(transactionContext);
export const organizationService = new OrganizationService(transactionContext);
export const paymentService = new PaymentService(transactionContext);
export const productPriceService = new ProductPriceService(transactionContext);
export const productService = new ProductService(transactionContext);
export const roleService = new RoleService(transactionContext);
export const s3Service = new S3Service();
export const sessionService = new SessionService(transactionContext);
export const userService = new UserService(transactionContext);

export const systemVariableService = new SystemVariableService(transactionContext);

export const websocketsService = new WebsocketsService();
