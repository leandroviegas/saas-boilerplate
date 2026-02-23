import { FastifyInstance } from "fastify";
import { notificationController } from "@/http/member/notification/notification.controller";
import { sessionController } from "@/http/member/session/session.controller";
import { paymentController } from "@/http/member/payment/payment.controller";
import { userController } from "@/http/member/user/user.controller";

export async function memberRoutes(server: FastifyInstance) {
    server.register(sessionController, { prefix: "/sessions" });
    server.register(notificationController, { prefix: "/notifications" });
    server.register(paymentController, { prefix: "/payments" });
    server.register(userController, { prefix: "/users" });
};
