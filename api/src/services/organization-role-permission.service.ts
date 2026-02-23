import { PermissionsMap } from "@/middleware/permission.middleware";
import { AbstractService } from "@/services/abstract.service";
import { Prisma } from "@prisma/client";

export class OrganizationRolePermissionService extends AbstractService {
  findAll() {
    return this.prisma.organizationRolePermissions.findMany({
      include: {
        organization: true,
        role: true,
      },
    });
  }

  findByOrganizationId(organizationId: string) {
    return this.prisma.organizationRolePermissions.findMany({
      where: { organizationId },
      include: {
        role: true,
      },
    });
  }

  findByRoleSlug(roleSlug: string) {
    return this.prisma.organizationRolePermissions.findMany({
      where: { roleSlug },
      include: {
        organization: true,
      },
    });
  }

  findById(organizationId: string, roleSlug: string) {
    return this.prisma.organizationRolePermissions.findUniqueOrThrow({
      where: {
        organizationId_roleSlug: {
          organizationId,
          roleSlug,
        },
      },
      include: {
        organization: true,
        role: true,
      },
    });
  }

  async findPermissionsById(organizationId: string, roleSlug: string): Promise<PermissionsMap> {
    const organizationRolePermission = await this.prisma.organizationRolePermissions.findUniqueOrThrow({
      where: {
        organizationId_roleSlug: {
          organizationId,
          roleSlug,
        },
      },
      include: {
        organization: true,
        role: true,
      },
    });
    return organizationRolePermission.permissions as PermissionsMap;
  }

  create(data: Prisma.OrganizationRolePermissionsCreateInput) {
    return this.prisma.organizationRolePermissions.create({
      data,
      include: {
        organization: true,
        role: true,
      },
    });
  }

  update(
    organizationId: string,
    roleSlug: string,
    data: Prisma.OrganizationRolePermissionsUpdateInput
  ) {
    return this.prisma.organizationRolePermissions.update({
      where: {
        organizationId_roleSlug: {
          organizationId,
          roleSlug,
        },
      },
      data,
      include: {
        organization: true,
        role: true,
      },
    });
  }

  delete(organizationId: string, roleSlug: string) {
    return this.prisma.organizationRolePermissions.delete({
      where: {
        organizationId_roleSlug: {
          organizationId,
          roleSlug,
        },
      },
    });
  }

  upsert(
    organizationId: string,
    roleSlug: string,
    permissions: Prisma.InputJsonValue
  ) {
    return this.prisma.organizationRolePermissions.upsert({
      where: {
        organizationId_roleSlug: {
          organizationId,
          roleSlug,
        },
      },
      update: {
        permissions,
      },
      create: {
        organizationId,
        roleSlug,
        permissions,
      },
      include: {
        organization: true,
        role: true,
      },
    });
  }
}