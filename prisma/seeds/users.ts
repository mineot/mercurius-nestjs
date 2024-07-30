import { PrismaClient, User } from '@prisma/client';
import { error, finish, info, start, success, warn } from '../helper/logger';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function SeedUsers() {
  try {
    start('Seeding Users');

    const user: User = {
      id: undefined,
      name: 'Administrator',
      email: 'admin@admin.com',
      password: await bcrypt.hash('admin!123987', 10),
    };

    info('User:', user.name);

    const counter = await prisma.user.count({
      where: {
        email: user.email,
      },
    });

    if (counter === 0) {
      await prisma.user.create({ data: user });
      success('Success Seeded');
    } else {
      warn('User Already Seeded');
    }
  } catch (e) {
    error('Seeding User Failed', e);
  } finally {
    await prisma.$disconnect();
    finish('Seeding Users');
  }
}
