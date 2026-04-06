import logger from "@/infrastructure/logger/logger";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { SystemVariableService } from "@/application/shared/system-variable.service";
import { PrismaTransactionContext } from "@/infrastructure/database/prisma/transaction-context";

export class S3Service {
  systemVariableService: SystemVariableService;

  constructor(transaction: PrismaTransactionContext) {
    this.systemVariableService = new SystemVariableService(transaction);
  }

  async getS3Client() {
    const s3Config = await this.systemVariableService.getS3Config();

    const s3Client = new S3Client({
      region: s3Config.region!,
      credentials: {
        accessKeyId: s3Config.accessKeyId!,
        secretAccessKey: s3Config.accessKeyId!,
      },
      endpoint: s3Config.endpoint!,
      forcePathStyle: s3Config.forcePathStyle!,
    });

    return { s3Client };
  }

  async uploadFile(file: Buffer, key: string, contentType?: string) {
    const s3Config = await this.systemVariableService.getS3Config();
    const { s3Client } = await this.getS3Client();

    const command = new PutObjectCommand({
      Bucket: s3Config.bucket!,
      Key: key,
      Body: file,
      ContentType: contentType,
      ACL: 'public-read',
    });

    await s3Client.send(command);
  }

  async deleteFile(key?: string | null) {
    const s3Config = await this.systemVariableService.getS3Config();
    const { s3Client } = await this.getS3Client();

    if (!key) return;
    try {
      const command = new DeleteObjectCommand({
        Bucket: s3Config.bucket!,
        Key: key,
      });

      await s3Client.send(command);
    } catch (e) {
      logger.error(e)
    }
  }
}