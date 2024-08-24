import { Language, PrismaClient, Profile } from '@prisma/client';
import { error, finish, info, start, success } from '../helpers/logger_seeders';
import { warn } from 'console';

const prisma = new PrismaClient();

const profiles = {
  US: {
    id: undefined,
    langId: null,
    name: 'Joe Doe',
    job_title: 'General Affairs Assistant',
    summary:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam in magna dui. Proin tristique, nisl',
    biography:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean fringilla sapien ac turpis gravida, ut semper enim scelerisque. Integer rhoncus nec metus sed tincidunt. Cras finibus enim et eros bibendum scelerisque. Vestibulum ac tellus eget neque scelerisque cursus at ut.',
    photo_sm: 'https://i.pravatar.cc/250',
    photo_lg: 'https://i.pravatar.cc/500',
    activity:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempus ipsum mi, ut mollis lorem posuere tempor. Morbi commodo ut ante consequat varius. Morbi porttitor et nunc in cursus. Praesent.',
  },
  BR: {
    id: undefined,
    langId: null,
    name: 'João Ninguem',
    job_title: 'Assistente de Assuntos Gerais',
    summary:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam in magna dui. Proin tristique, nisl',
    biography:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean fringilla sapien ac turpis gravida, ut semper enim scelerisque. Integer rhoncus nec metus sed tincidunt. Cras finibus enim et eros bibendum scelerisque. Vestibulum ac tellus eget neque scelerisque cursus at ut.',
    photo_sm: 'https://i.pravatar.cc/250',
    photo_lg: 'https://i.pravatar.cc/500',
    activity:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempus ipsum mi, ut mollis lorem posuere tempor. Morbi commodo ut ante consequat varius. Morbi porttitor et nunc in cursus. Praesent.',
  },
};

async function findLanguage(lang: string, country: string): Promise<Language> {
  return prisma.language.findFirst({
    where: {
      AND: [{ lang }, { country }],
    },
  });
}

async function profile(language: Language): Promise<Profile> {
  const profile: Profile = profiles[language.country];
  profile.langId = language.id;
  return profile;
}

async function count(profile: Profile): Promise<number> {
  return await prisma.profile.count({
    where: { name: profile.name },
  });
}

async function process(profile: Profile) {
  info('Profile:', profile.name);

  if ((await count(profile)) > 0) {
    warn('Profile already exists:', profile.name);
  } else {
    await prisma.profile.create({ data: profile });
    success('Profile created:', profile.name);
  }
}

export async function profilesSeeder() {
  try {
    start('Seeding Profiles');

    const englishLanguage: Language = await findLanguage('en', 'US');
    const portugueseLanguage: Language = await findLanguage('pt', 'BR');
    const englishProfile: Profile = await profile(englishLanguage);
    const portugueseProfile: Profile = await profile(portugueseLanguage);

    await process(englishProfile);
    await process(portugueseProfile);
  } catch (e) {
    error('Seeding Profiles Failed', e);
  } finally {
    await prisma.$disconnect();
    finish('Seeding Profiles');
  }
}
