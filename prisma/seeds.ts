import { PrismaClient, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const user: User = {
    id: undefined,
    name: 'Administrator',
    email: 'admin@admin.com',
    password: await bcrypt.hash('admin!123987', 10),
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
