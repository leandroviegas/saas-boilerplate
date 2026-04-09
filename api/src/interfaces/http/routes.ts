import { Elysia } from 'elysia';
import { authController } from './controllers/auth.controller';
import { adminCouponController } from './controllers/admin/coupon.controller';
import { adminProductController } from './controllers/admin/product.controller';
import { adminProductPriceController } from './controllers/admin/product-price.controller';
import { adminRoleController } from './controllers/admin/role.controller';
import { adminRolePermissionController } from './controllers/admin/role-permission.controller';
import { adminUserController } from './controllers/admin/user.controller';
import { adminSystemVariableController } from './controllers/admin/system-variable.controller';
import { memberNotificationController } from './controllers/member/notification.controller';
import { memberPaymentController } from './controllers/member/payment.controller';
import { memberSessionController } from './controllers/member/session.controller';
import { memberUserController } from './controllers/member/user.controller';
import { webhookController } from './controllers/webhook/webhook.controller';
import { systemController } from './controllers/system.controller';

export const routes = new Elysia()
    .use(webhookController)
    .use(systemController)
    .use(authController)
    .group('/admin', (app) => app
        .use(adminCouponController)
        .use(adminProductController)
        .use(adminProductPriceController)
        .use(adminRoleController)
        .use(adminRolePermissionController)
        .use(adminUserController)
        .use(adminSystemVariableController)
    )
    .group('/member', (app) => app
        .use(memberNotificationController)
        .use(memberPaymentController)
        .use(memberSessionController)
        .use(memberUserController)
    );

