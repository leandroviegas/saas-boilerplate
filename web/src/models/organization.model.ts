export interface OrganizationType {
  id: string;
  name: string;
  slug?: string | null;
  logo?: string | null;
  createdAt: string;
  updatedAt: string;
  metadata?: string | null;
}

export class OrganizationDTO {
  id: string;
  name: string;
  slug?: string | null;
  logo?: string | null;
  createdAt: Date;
  updatedAt: Date;
  metadata?: any;

  constructor(dto: OrganizationType) {
    this.id = dto.id;
    this.name = dto.name;
    this.slug = dto.slug;
    this.logo = dto.logo;
    this.createdAt = new Date(dto.createdAt);
    this.updatedAt = new Date(dto.updatedAt);
    this.metadata = dto.metadata ? JSON.parse(dto.metadata) : null;
  }
}
