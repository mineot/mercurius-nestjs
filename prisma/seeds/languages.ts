import { Language, PrismaClient } from '@prisma/client';
import { error, finish, info, start, success, warn } from './helper/logger';

const prisma = new PrismaClient();

async function englishData(): Promise<Language> {
  return {
    id: undefined,
    name: 'English USA',
    lang: 'en',
    country: 'US',
  };
}

async function portugueseData(): Promise<Language> {
  return {
    id: undefined,
    name: 'Português Brasil',
    lang: 'pt',
    country: 'BR',
  };
}

async function exists(language: Language): Promise<number> {
  return await prisma.language.count({
    where: {
      lang: language.lang,
      country: language.country,
    },
  });
}

export async function languagesSeeder() {
  try {
    start('Seeding Languages');

    const english: Language = await englishData();
    const portuguese: Language = await portugueseData();

    info('Languages:', [english.name, portuguese.name]);

    if ((await exists(english)) === 0) {
      await prisma.language.create({ data: english });
      success('Language created:', english.name);
    } else {
      warn('Language already exists:', english.name);
    }

    if ((await exists(portuguese)) === 0) {
      await prisma.language.create({ data: portuguese });
      success('Language created:', portuguese.name);
    } else {
      warn('Language already exists:', portuguese.name);
    }
  } catch (e) {
    error('Seeding Languages Failed', e);
  } finally {
    await prisma.$disconnect();
    finish('Seeding Languages');
  }
}
