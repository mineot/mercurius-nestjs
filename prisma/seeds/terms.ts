import { PrismaClient, Term } from '@prisma/client';
import { error, finish, info, start, success, warn } from '../helper/logger';

const prisma = new PrismaClient();

export async function SeedTerms() {
  try {
    start('Seeding Terms');

    const languages = {
      us: await prisma.language.findFirst({
        where: {
          AND: [{ lang: 'en' }, { country: 'US' }],
        },
      }),
      br: await prisma.language.findFirst({
        where: { lang: 'pt', country: 'BR' },
      }),
    };

    terms.forEach(async (term: any) => {
      const enTerm: Term = {
        id: undefined,
        code: term.code,
        value: term[languages.us.country.toLowerCase()],
        langId: languages.us.id,
      };

      info('Seeding Terms:', [
        languages.us.lang,
        languages.us.country,
        enTerm.code,
        enTerm.value,
      ]);

      const ptTerm: Term = {
        id: undefined,
        code: term.code,
        value: term[languages.br.country.toLowerCase()],
        langId: languages.br.id,
      };

      info('Seeding Terms:', [
        languages.br.lang,
        languages.br.country,
        ptTerm.code,
        ptTerm.value,
      ]);

      const counter = {
        us: await prisma.term.count({
          where: { code: enTerm.code },
        }),
        br: await prisma.term.count({
          where: { code: ptTerm.code },
        }),
      };

      if (counter.us === 0) {
        await prisma.term.create({ data: enTerm });
        success('Seeded Term Successfully', [
          languages.us.lang,
          languages.us.country,
          enTerm.code,
          enTerm.value,
        ]);
      } else {
        warn('Term Already Seeded', [
          languages.us.lang,
          languages.us.country,
          enTerm.code,
          enTerm.value,
        ]);
      }

      if (counter.br === 0) {
        await prisma.term.create({ data: ptTerm });
        success('Seeded Term Successfully', [
          languages.br.lang,
          languages.br.country,
          ptTerm.code,
          ptTerm.value,
        ]);
      } else {
        warn('Term Already Seeded', [
          languages.br.lang,
          languages.br.country,
          ptTerm.code,
          ptTerm.value,
        ]);
      }
    });
  } catch (e) {
    error('Seeding Terms Failed', e);
  } finally {
    await prisma.$disconnect();
    finish('Seeding Terms');
  }
}

const terms = [{ code: 'app.name', us: 'Mercurius', br: 'Mercurius' }];
