import { FastifyInstance } from "fastify";
import { Role } from "@prisma/client";
import { notificationController } from "@/http/member/notification/notification.controller";
import { sessionController } from "@/http/member/session/session.controller";
import { paymentController } from "@/http/member/payment/payment.controller";
import { userController } from "@/http/member/user/user.controller";
import { accessMiddleware } from "@/middleware/access.middleware";

export async function memberRoutes(server: FastifyInstance) {
    server.addHook('preHandler', (req, reply) => accessMiddleware(req, reply, [Role.ADMIN, Role.MEMBER]));
    server.register(sessionController, { prefix: "/sessions" });
    server.register(notificationController, { prefix: "/notifications" });
    server.register(paymentController, { prefix: "/payments" });
    server.register(userController, { prefix: "/users" });
};
