export interface RoleType {
  slug: string;
  privilege: number;
  createdAt: string;
  updatedAt: string;
}

export class RoleDTO {
  slug: string;
  privilege: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(dto: RoleType) {
    this.slug = dto.slug;
    this.privilege = dto.privilege;
    this.createdAt = new Date(dto.createdAt);
    this.updatedAt = new Date(dto.updatedAt);
  }
}
