import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL
});

const adapter = new PrismaPg(pool);

export type PaginationOptions = {
    page?: number | string;
    perPage?: number | string;
};

export const paginationExtension = Prisma.defineExtension(client => {
    return client.$extends({
        name: 'pagination',
        model: {
            $allModels: {
                async paginate<T, A>(
                    this: T,
                    arg: Prisma.Exact<A, Prisma.Args<T, 'findMany'>>,
                    options: PaginationOptions
                ): Promise<
                    {
                        data: Prisma.Result<T, A, 'findMany'>,
                        meta: { total: number; page: number; perPage: number; }
                    }> {
                    const args: any = arg;
                    const context: any = Prisma.getExtensionContext(this);

                    const page = Number(options.page) || 1;
                    const perPage = Number(options.perPage) || 10;
                    const skip = page > 0 ? perPage * (page - 1) : 0;

                    const countArgs = args && args.where ? { where: args.where } : {};

                    const [total, data] = await client.$transaction([
                        context.count(countArgs),
                        context.findMany({
                            ...args,
                            take: perPage,
                            skip,
                        }),
                    ]);

                    return {
                        data,
                        meta: {
                            total,
                            page,
                            perPage
                        }
                    };
                },
            },
        },
    });
});

function InitializeExtendedPrisma() {
    const client = new PrismaClient({ adapter });
    return client.$extends(paginationExtension);
}

const prismaBase = new PrismaClient({ adapter });

export const prisma = prismaBase.$extends(paginationExtension);

export type ExtendedPrismaClient = ReturnType<typeof InitializeExtendedPrisma>;
