import { s3Config } from "@/config";
import logger from "@/plugins/logger";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

export class S3Service {
  private s3: S3Client;

  constructor() {
    this.s3 = new S3Client({
      region: s3Config.region,
      credentials: {
        accessKeyId: s3Config.accessKeyId,
        secretAccessKey: s3Config.accessKeyId,
      },
      endpoint: s3Config.endpoint,
      forcePathStyle: s3Config.forcePathStyle,
    });
  }

  async uploadFile(file: Buffer, key: string, contentType?: string) {
    const command = new PutObjectCommand({
      Bucket: s3Config.bucket,
      Key: key,
      Body: file,
      ContentType: contentType,
      ACL: 'public-read',
    });

    await this.s3.send(command);
  }

  async deleteFile(key?: string | null) {
    if (!key) return;
    try {
      const command = new DeleteObjectCommand({
        Bucket: s3Config.bucket,
        Key: key,
      });

      await this.s3.send(command);
    } catch (e) {
      logger.error(e)
    }
  }
}