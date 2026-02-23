import { ExtendedPrismaClient } from "@/plugins/prisma";

export abstract class AbstractService {
    prisma: ExtendedPrismaClient;
    constructor(prisma: ExtendedPrismaClient) {
        this.prisma = prisma;
    }
}