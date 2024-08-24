import { PrismaClient, User } from '@prisma/client';
import {
  error,
  finish,
  info,
  start,
  success,
  warn,
} from '../helpers/logger_seeders';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function userData(): Promise<User> {
  return {
    id: undefined,
    name: 'Administrator',
    email: 'admin@admin.com',
    password: await bcrypt.hash('admin!123987', 10),
    twoFactorSecret: null,
  };
}

async function validate(email: string): Promise<boolean> {
  const counter = await prisma.user.count({
    where: { email },
  });

  return counter > 0;
}

export async function userSeeder() {
  try {
    start('Seeding Users');

    const user: User = await userData();
    const exists: boolean = await validate(user.email);

    info('User:', `${user.name}, ${user.email}`);

    if (exists) {
      warn('User already exists');
    } else {
      await prisma.user.create({ data: user });
      success('User created');
    }
  } catch (e) {
    error('Failed to seed users:', error);
  } finally {
    prisma.$disconnect();
    finish('Seeding Users');
  }
}
