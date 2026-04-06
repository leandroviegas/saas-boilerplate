import { AbstractService } from "@/domain/shared/abstract.service";
import { ioredis } from "@/infrastructure/cache/redis";
import { webUrl } from "@/infrastructure/config/env";


export class SystemVariableService extends AbstractService {
  CACHE_TTL = 3600
  CACHE_PREFIX = "system-variable:"

  private getCacheKey(id: string): string {
    return `${this.CACHE_PREFIX}${id}`;
  }

  async findMany() {
    return await this.prisma.systemVariable.paginate({}, { page: 1, perPage: 1000 });
  }

  async findUnique(id: string) {
    return await this.prisma.systemVariable.findUniqueOrThrow({ where: { id } });
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

  async get<T = string>(id: string, defaultValue?: T) {
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

  async getEmailConfig() {
    return {
      host: await this.get("SMTP_HOST"),
      port: Number(await this.get("SMTP_PORT", 587)),
      secure: Boolean(await this.get("SMTP_SECURE", false)),
      user: await this.get("SMTP_USER"),
      password: await this.get("SMTP_PASSWORD"),
      from: await this.get("SMTP_FROM"),
      rejectUnauthorized: await this.get("SMTP_REJECT_UNAUTHORIZED") !== "false",
    };
  }

  async getS3Config() {
    return {
      region: await this.get("S3_REGION"),
      accessKeyId: await this.get("S3_ACCESS_KEY_ID"),
      secretAccessKey: await this.get("S3_SECRET_ACCESS_KEY"),
      endpoint: await this.get("S3_ENDPOINT"),
      forcePathStyle: Boolean(await this.get("S3_FORCE_PATH_STYLE")),
      bucket: await this.get("S3_BUCKET_NAME")
    };
  }

  async getStripeConfig() {
    return {
      apiKey: await this.get("STRIPE_SECRET_KEY"),
      webhookSecret: await this.get("STRIPE_WEBHOOK_SECRET"),
      successUrl: `${webUrl}/dashboard/billing?success=true`,
      cancelUrl: `${webUrl}/dashboard/billing?canceled=true`,
    };
  }

  async delete(id: string) {
    const result = await this.prisma.systemVariable.delete({
      where: { id }
    });

    await ioredis.del(this.getCacheKey(id));

    return result;
  }
}