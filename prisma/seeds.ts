import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user: User = {
    id: undefined,
    name: 'Administrator',
    email: 'admin@admin.com',
  };

  await prisma.user.create({ data: user });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
