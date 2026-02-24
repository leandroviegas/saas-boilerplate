import { auth } from './auth';
import { prisma, ExtendedPrismaClient } from './plugins/prisma';
import 'dotenv/config';

async function seedRoles(prisma: ExtendedPrismaClient) {
    const roles = await prisma.role.createMany({
        data: [
            { slug: 'ADMIN', privilege: 0 },
            { slug: 'OWNER', privilege: 10 },
        ],
        skipDuplicates: true,
    });

    console.log('Created roles:', roles);
}

async function seedUser(prisma: ExtendedPrismaClient) {
    const existingUser = await prisma.user.findUnique({
        where: { email: 'admin@admin.com' },
    });

    if (!existingUser) {
        try {
            const result = await auth.api.signUpEmail({
                body: {
                    email: 'admin@admin.com',
                    password: '12345678',
                    name: 'Admin User',
                    username: 'admin',
                },
            });

            const adminUser = await prisma.user.update({
                where: { id: result.user.id },
                data: {
                    role: { connect: { slug: "ADMIN" } },
                    emailVerified: true,
                },
            });

            console.log('Created user:', adminUser.email);
        } catch (error) {
            console.error('Error creating user:', error);
        }
    }
}

export async function seed() {
    console.log('Starting database seeding...');

    await seedRoles(prisma);

    await seedUser(prisma);

    console.log('Database seeding completed successfully!');
}

