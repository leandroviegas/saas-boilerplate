import { wsTypeEnum, wsEventEnum } from "@/enums/websocketsEnum";
import { pubClient } from "@/plugins/ioredis";
import { Notification } from "@prisma/client";

export interface WsData {
    type: wsTypeEnum,
}

export interface WsTo {
    user?: string;
    session?: string;
    everyone?: boolean;
}

type NotificationDataT = Notification;

interface WsNotificationData extends WsData {
    type: wsTypeEnum.NEW_NOTIFICATION,
    notification: NotificationDataT
}

export class WebsocketsService {
    async sendSockets(event: wsEventEnum, to: WsTo, data: WsData) {
        await pubClient.publish(event, JSON.stringify({
            to,
            data
        }));
    }

    async sendNewNotification(to: WsTo, data: NotificationDataT) {
        const socketsData: WsNotificationData = { type: wsTypeEnum.NEW_NOTIFICATION, notification: data };
        await this.sendSockets(wsEventEnum.NOTIFICATION, to, socketsData);
    }

    async sendSessionRevoked(to: WsTo) {
        await this.sendSockets(wsEventEnum.AUTH, to, { type: wsTypeEnum.SESSION_REVOKED });
    }
}