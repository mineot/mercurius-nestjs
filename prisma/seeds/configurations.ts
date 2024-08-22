import { Configuration, PrismaClient } from '@prisma/client';
import { error, finish, start, success, warn } from './helper/logger';

const prisma = new PrismaClient();

async function validate(): Promise<boolean> {
  const counter = await prisma.configuration.count();

  return counter === 0;
}

export async function configurationSeeder() {
  try {
    start('Seeding Configurations');

    if (await validate()) {
      await prisma.configuration.create({
        data: {
          id: undefined,
          allow_register: false,
          allow_two_factor: false,
        },
      });

      success('Configuration created');
    } else {
      warn('Configuration already exists');
    }
  } catch (e) {
    error('Failed to seed configurations:', error);
  } finally {
    prisma.$disconnect();
    finish('Seeding Configurations');
  }
}
