import { AbstractService } from "@/services/abstract.service";
import { ioredis } from "@/plugins/ioredis";
import { Prisma } from "@prisma/client";


export class SystemVariableService extends AbstractService {
  CACHE_TTL = 3600
  CACHE_PREFIX = "system-variable:"

  private getCacheKey(id: string): string {
    return `${this.CACHE_PREFIX}${id}`;
  }

  async set(id: string, value: string) {
    const result = await this.prisma.systemVariable.upsert({
      where: { id },
      update: { value },
      create: { id, value },
    });

    await ioredis.setex(this.getCacheKey(id), this.CACHE_TTL, value);

    return result;
  }

  async get<T>(id: string, defaultValue?: T) {
    const cachedValue = await ioredis.get(this.getCacheKey(id));
    if (cachedValue !== null) {
      return cachedValue as T;
    }

    const systemVariable = await this.prisma.systemVariable.findFirst({ where: { id } });
    if (systemVariable) {
      await ioredis.setex(this.getCacheKey(id), this.CACHE_TTL, systemVariable.value);
      return systemVariable.value as T;
    }

    return defaultValue ?? null;
  }

  async findMany(options: {
    skip?: number;
    take?: number;
    orderBy?: Prisma.SystemVariableOrderByWithRelationInput;
  }) {
    const { skip = 0, take = 10, orderBy = { updatedAt: 'desc' } } = options;

    const [data, total] = await Promise.all([
      this.prisma.systemVariable.findMany({
        skip,
        take,
        orderBy
      }),
      this.prisma.systemVariable.count()
    ]);

    return { data, total };
  }

  async findUnique(id: string) {
    return this.prisma.systemVariable.findUniqueOrThrow({
      where: { id }
    });
  }

  async delete(id: string) {
    const result = await this.prisma.systemVariable.delete({
      where: { id }
    });

    await ioredis.del(this.getCacheKey(id));

    return result;
  }
}