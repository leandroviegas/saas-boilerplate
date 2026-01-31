import { Session } from "@prisma/client";
import { AbstractService } from "@/services/abstract.service";
import { websocketsService } from "@/services";

export class SessionService extends AbstractService {
  async findAllByUserId(userId: string): Promise<Session[]> {
    return await this.prisma.session.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async revoke(id: string, userId: string) {
    const session = await this.prisma.session.findUniqueOrThrow({ where: { id, userId } });

    await this.prisma.session.delete({ where: { id: session.id } });

    await websocketsService.sendSessionRevoked({ session: session.id });
  }
}