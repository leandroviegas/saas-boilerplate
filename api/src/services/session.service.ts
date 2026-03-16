import { Session } from "@prisma/client";
import { AbstractService } from "@/services/abstract.service";
import { websocketsService } from "@/services";
import { PaginationType } from "@/schemas/pagination";

export class SessionService extends AbstractService {
  async findAllByUserId(userId: string, pagination: PaginationType) {
    const { page, perPage } = pagination;

    return await this.prisma.session.paginate(
      { where: { userId }, orderBy: { createdAt: 'desc' } },
      { page, perPage }
    );
  }

  async revoke(id: string, userId: string) {
    const session = await this.prisma.session.findUniqueOrThrow({ where: { id, userId } });

    await this.prisma.session.delete({ where: { id: session.id } });

    await websocketsService.sendSessionRevoked({ session: session.id });
  }
}