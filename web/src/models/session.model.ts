export interface SessionDTO {
  id: string;
  userId: string;
  expiresAt: string;
  token: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  activeOrganizationId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export class Session {
  id: string;
  userId: string;
  expiresAt: Date;
  token: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  activeOrganizationId?: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(dto: SessionDTO) {
    this.id = dto.id;
    this.userId = dto.userId;
    this.expiresAt = new Date(dto.expiresAt);
    this.token = dto.token;
    this.ipAddress = dto.ipAddress;
    this.userAgent = dto.userAgent;
    this.activeOrganizationId = dto.activeOrganizationId;
    this.createdAt = new Date(dto.createdAt);
    this.updatedAt = new Date(dto.updatedAt);
  }

  get isExpired(): boolean {
    return this.expiresAt < new Date();
  }
}
