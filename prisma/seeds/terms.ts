import { Language, PrismaClient, Term } from '@prisma/client';
import { error, finish, info, start, success, warn } from './helper/logger';

const prisma = new PrismaClient();

const terms = [{ code: 'app.name', us: 'Mercurius', br: 'Mercurius' }];

async function findLanguage(lang: string, country: string): Promise<Language> {
  return await prisma.language.findFirst({
    where: {
      AND: [{ lang }, { country }],
    },
  });
}

async function term(item: any, language: Language): Promise<Term> {
  return {
    id: undefined,
    code: item.code,
    value: item[language.country.toLowerCase()],
    langId: language.id,
  };
}

async function count(code: string, langId: string): Promise<number> {
  return await prisma.term.count({
    where: { AND: [{ code }, { langId }] },
  });
}

async function process(exists: boolean, data: Term) {
  if (exists) {
    warn('Term Already exists');
  } else {
    await prisma.term.create({ data });
    success('Term created');
  }
}

async function loop(language: Language) {
  const promises = [];

  terms.forEach(async (item: any) => {
    promises.push(
      new Promise(async (resolve) => {
        const tt: Term = await term(item, language);
        info('Term:', `${language.name}: ${tt.code}`);
        await process((await count(tt.code, language.id)) > 0, tt);
        resolve(1);
      }),
    );
  });

  return Promise.all(promises);
}

export async function termsSeeder() {
  try {
    start('Seeding Terms');
    const englishLanguage: Language = await findLanguage('en', 'US');
    const portugueseLanguage: Language = await findLanguage('pt', 'BR');
    await loop(englishLanguage);
    await loop(portugueseLanguage);
  } catch (e) {
    error('Seeding Terms Failed', e);
  } finally {
    await prisma.$disconnect();
    finish('Seeding Terms');
  }
}
