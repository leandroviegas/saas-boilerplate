import { Role, RoleDTO } from "./role.model";

export interface UserDTO {
  id: string;
  email: string;
  username: string;
  name: string;
  image?: string | null;
  roleSlug?: string | null;
  emailVerified: boolean;
  preferences?: string | null;
  twoFactorEnabled?: boolean | null;
  createdAt: string;
  updatedAt: string;
  role?: RoleDTO | null;
}

export class User {
  id: string;
  email: string;
  username: string;
  name: string;
  image?: string | null;
  roleSlug?: string | null;
  emailVerified: boolean;
  preferences?: any;
  twoFactorEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  role?: Role | null;

  constructor(dto: UserDTO) {
    this.id = dto.id;
    this.email = dto.email;
    this.username = dto.username;
    this.name = dto.name;
    this.image = dto.image;
    this.roleSlug = dto.roleSlug;
    this.emailVerified = dto.emailVerified;
    this.preferences = dto.preferences ? JSON.parse(dto.preferences) : null;
    this.twoFactorEnabled = !!dto.twoFactorEnabled;
    this.createdAt = new Date(dto.createdAt);
    this.updatedAt = new Date(dto.updatedAt);
    this.role = dto.role ? new Role(dto.role) : null;
  }

  get initials(): string {
    return this.name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  }
}
