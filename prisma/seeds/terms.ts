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

async function createTerm(
  code: string,
  value: string,
  langId: string,
): Promise<Term> {
  return { id: undefined, code, value, langId };
}

async function count(code: string, langId: string): Promise<number> {
  return await prisma.term.count({
    where: { AND: [{ code }, { langId }] },
  });
}

async function process(exists: boolean, data: Term, desc: string) {
  if (!exists) {
    await prisma.term.create({ data });
    success('Term created:', desc);
  } else {
    warn('Term Already exists:', desc);
  }
}

async function loop(language: Language) {
  const promises = [];

  terms.forEach(async (term: any) => {
    promises.push(
      new Promise(async (resolve) => {
        const tt: Term = await createTerm(
          term.code,
          term[language.country.toLowerCase()],
          language.id,
        );

        const desc: string = `${language.name}: ${tt.code}`;

        info('Terms:', desc);

        await process((await count(tt.code, language.id)) === 0, tt, desc);

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
