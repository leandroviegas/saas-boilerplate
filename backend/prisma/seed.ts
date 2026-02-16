import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      username: 'admin',
      role: Role.ADMIN,
      emailVerified: true,
    },
  });

  console.log('Created admin user:', adminUser.email);

  // Create test member user
  const memberUser = await prisma.user.upsert({
    where: { email: 'member@example.com' },
    update: {},
    create: {
      email: 'member@example.com',
      name: 'Member User',
      username: 'member',
      role: Role.MEMBER,
      emailVerified: true,
    },
  });

  console.log('Created member user:', memberUser.email);

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
