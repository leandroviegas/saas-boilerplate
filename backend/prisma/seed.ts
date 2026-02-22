import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


async function Roles(prisma: PrismaClient) {
    const roles = await prisma.role.createMany({
        data: [
            { slug: 'admin', name: 'admin' },
            { slug: 'owner', name: 'owner' },
        ],
    });

    console.log('Created roles:', roles);
}

async function User(prisma: PrismaClient) {
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@admin.com' },
        update: {},
        create: {
            email: 'admin@admin.com',
            name: 'Admin User',
            username: 'admin',
            role: { connect: { slug: "admin" } },
            emailVerified: true,
        },
    });

    console.log('Created user:', adminUser.email);
}

async function main() {
    console.log('Starting database seeding...');

    await Roles(prisma);

    await User(prisma);

    console.log('Database seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error('Error during seeding:', e);
        // @ts-ignore
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
