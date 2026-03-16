export interface NotificationType {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  link?: string | null;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export class NotificationDTO {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  link?: string | null;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(dto: NotificationType) {
    this.id = dto.id;
    this.userId = dto.userId;
    this.title = dto.title;
    this.message = dto.message;
    this.type = dto.type;
    this.link = dto.link;
    this.read = dto.read;
    this.createdAt = new Date(dto.createdAt);
    this.updatedAt = new Date(dto.updatedAt);
  }
}
