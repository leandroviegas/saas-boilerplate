import { AbstractService } from "@/services/abstract.service";
import { Prisma } from "@prisma/client";
import { PaginationType } from "@/schemas/pagination";

export class OrganizationService extends AbstractService {
  findAll(pagination: PaginationType) {
    return this.prisma.organization.paginate({
      orderBy: { createdAt: 'desc' },
    }, pagination);
  }

  findById(id: string) {
    return this.prisma.organization.findUniqueOrThrow({
      where: { id },
    });
  }

  findFirstByOwner(userId: string) {
    return this.prisma.organization.findFirstOrThrow({
      where: { 
        members: {
          some: {
            userId,
            role: 'owner'
          }
        }
      },
    });
  }

  findBySlug(slug: string) {
    return this.prisma.organization.findUnique({
      where: { slug },
    });
  }

  create(data: Prisma.OrganizationCreateInput) {
    return this.prisma.organization.create({
      data,
    });
  }

  update(id: string, data: Prisma.OrganizationUpdateInput) {
    return this.prisma.organization.update({
      where: { id },
      data,
    });
  }

  delete(id: string) {
    return this.prisma.organization.delete({
      where: { id },
    });
  }

  upsert(data: Prisma.OrganizationCreateInput) {
    return this.prisma.organization.upsert({
      where: { id: data.id ?? '' },
      update: {},
      create: data,
    });
  }
}
