import { PaginationType } from "@/schemas/pagination";
import { AbstractService } from "@/services/abstract.service";
import { websocketsService } from "@/services";

export class NotificationService extends AbstractService {
  async findAllByUserId(userId: string, pagination: PaginationType) {
    let where = { userId };

    return await this.prisma.notification.paginate({
      where,
      orderBy: { createdAt: 'desc' },
    }, pagination);
  }

  async create(data: {
    userId: string;
    title: string;
    message: string;
    type: string;
    link?: string;
  }) {
    const notification = await this.prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type,
        link: data.link,
      },
    });

    websocketsService.sendNewNotification({ user: data.userId }, notification);

    return notification;
  }

  markAsRead(id: string, userId: string) {
    return this.prisma.notification.update({
      where: { id, userId },
      data: { read: true },
    });
  }

  markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }

  delete(id: string, userId: string) {
    return this.prisma.notification.delete({
      where: { id, userId },
    });
  }

  deleteAll(userId: string) {
    return this.prisma.notification.deleteMany({
      where: { userId },
    });
  }

}