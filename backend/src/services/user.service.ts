import { s3Service } from "@/services";
import { UpdateUserBodyType } from "../http/admin/user/user.schemas";
import { AbstractService } from "@/services/abstract.service";
import { PaginationType } from "@/schemas/pagination";

export class UserService extends AbstractService {
  findAll(pagination: PaginationType) {
    return this.prisma.user.paginate({
      orderBy: { createdAt: 'desc' },
    }, pagination);
  }

  findById(id: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id },
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: { email },
    });
  }

  async update(id: string, data: UpdateUserBodyType) {
    const existingUser = await this.findById(id);
    const oldImageUrl = existingUser.image;
    let newImageUrl = existingUser.image;
    let wasNewImageUploaded = false;

    if (data.image && data.image.startsWith('data:image/')) {
      const [mime, base64] = data.image.split(',');
      const contentType = mime.split(':')[1].split(';')[0];
      const buffer = Buffer.from(base64, 'base64');
      const extension = contentType.split('/')[1];

      newImageUrl = `users/${id}/profile-${Date.now()}.${extension}`;
      await s3Service.uploadFile(buffer, newImageUrl, contentType);
      wasNewImageUploaded = true;
    }

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          email: data.email,
          name: data.name,
          image: newImageUrl,
          username: data.username,
          preferences: data.preferences,
        },
      });

      // 3. Success: Delete the OLD image from S3 (if it changed)
      if (wasNewImageUploaded && oldImageUrl) {
        await s3Service.deleteFile(oldImageUrl);
      }

      return updatedUser;
    } catch (error) {
      // 4. Failure: Cleanup the NEWLY uploaded image so S3 stays clean
      if (wasNewImageUploaded) {
        await s3Service.deleteFile(newImageUrl);
      }

      throw error;
    }
  }

  delete(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}