export interface SystemVariableType {
  id: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

export class SystemVariableDTO {
  id: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(dto: SystemVariableType) {
    this.id = dto.id;
    this.value = dto.value;
    this.createdAt = new Date(dto.createdAt);
    this.updatedAt = new Date(dto.updatedAt);
  }
}
