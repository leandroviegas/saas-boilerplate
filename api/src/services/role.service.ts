import { AbstractService } from "@/services/abstract.service";
import { PaginationType } from "@/schemas/pagination";
import { Prisma } from "@prisma/client";

export class RoleService extends AbstractService {
  findAll(pagination: PaginationType) {
    const { search, page, perPage } = pagination;

    let where: Prisma.RoleWhereInput = {};

    if (search) {
      where = {
        ...where,
        slug: { contains: search, mode: 'insensitive' }
      }
    }

    return this.prisma.role.paginate({ where, orderBy: { privilege: 'asc' } }, { page, perPage });
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
