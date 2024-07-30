import { Language, PrismaClient } from '@prisma/client';
import { error, finish, info, start, success, warn } from '../helper/logger';

const prisma = new PrismaClient();

export async function SeedLanguages() {
  try {
    start('Seeding Languages');

    const us: Language = {
      id: undefined,
      name: 'English USA',
      lang: 'en',
      country: 'US',
    };

    const br: Language = {
      id: undefined,
      name: 'Português Brasil',
      lang: 'pt',
      country: 'BR',
    };

    info('Seeding Languages:', [us.name, br.name]);

    const counter = {
      us: await prisma.language.count({
        where: {
          lang: us.lang,
          country: us.country,
        },
      }),
      br: await prisma.language.count({
        where: {
          lang: br.lang,
          country: br.country,
        },
      }),
    };

    if (counter.us === 0) {
      await prisma.language.create({ data: us });
      success('Seeded Language Successfully', us.name);
    } else {
      warn('Language Already Seeded', us.name);
    }

    if (counter.br === 0) {
      await prisma.language.create({ data: br });
      success('Seeded Language Successfully', br.name);
    } else {
      warn('Language Already Seeded', br.name);
    }
  } catch (e) {
    error('Seeding Languages Failed', e);
  } finally {
    await prisma.$disconnect();
    finish('Seeding Languages');
  }
}
