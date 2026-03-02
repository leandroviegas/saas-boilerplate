import { AbstractService } from "@/services/abstract.service";
import { Prisma } from "@prisma/client";

export class RoleService extends AbstractService {
  findAll() {
    return this.prisma.role.findMany({
      orderBy: {
        privilege: 'asc',
      },
    });
  }

  findById(slug: string) {
    return this.prisma.role.findUniqueOrThrow({
      where: { slug },
    });
  }

  findBySlug(slug: string) {
    return this.prisma.role.findUnique({
      where: { slug },
    });
  }

  create(data: Prisma.RoleCreateInput) {
    return this.prisma.role.create({
      data,
    });
  }

  update(slug: string, data: Prisma.RoleUpdateInput) {
    return this.prisma.role.update({
      where: { slug },
      data,
    });
  }

  delete(slug: string) {
    return this.prisma.role.delete({
      where: { slug },
    });
  }

  upsert(data: Prisma.RoleCreateInput) {
    return this.prisma.role.upsert({
      where: { slug: data.slug },
      update: {},
      create: data,
    });
  }
}
