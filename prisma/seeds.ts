import { Language, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const terms = {
  US: [
    {
      id: '15e4401e-ee9b-4946-a897-32aa917bc23b',
      code: 'app.name',
      value: 'Mercurius',
    },
  ],
  BR: [
    {
      id: 'e5f58e40-8b80-4194-a02b-e7227d6b3a21',
      code: 'app.name',
      value: 'Mercurius',
    },
  ],
};

async function seedTerm(lang: Language, item: any) {
  await prisma.term.upsert({
    where: { id: item.id },
    update: {},
    create: {
      id: item.id,
      langId: lang.id,
      code: item.code,
      value: item.value,
    },
  });
}

async function main() {
  await prisma.user.upsert({
    where: { id: '14c4b59f-ea85-4914-b9a4-e9a740d3bad6' },
    update: {},
    create: {
      id: '14c4b59f-ea85-4914-b9a4-e9a740d3bad6',
      name: 'Administrator',
      email: 'admin@admin.com',
      password: await bcrypt.hash('admin!123987', 10),
    },
  });

  await prisma.configuration.upsert({
    where: { id: 'aab60b90-efd8-4acd-87e2-86c240d3dcd5' },
    update: {},
    create: {
      id: 'aab60b90-efd8-4acd-87e2-86c240d3dcd5',
      allow_register: false,
      allow_two_factor: false,
    },
  });

  const us = await prisma.language.upsert({
    where: { id: '9f0c1732-6276-4882-a1d0-377efbcd61d0' },
    update: {},
    create: {
      id: '9f0c1732-6276-4882-a1d0-377efbcd61d0',
      name: 'English USA',
      lang: 'en',
      country: 'US',
    },
  });

  const br = await prisma.language.upsert({
    where: { id: 'd83dbf1d-4aa3-4bbb-a92b-f041b57b7c76' },
    update: {},
    create: {
      id: 'd83dbf1d-4aa3-4bbb-a92b-f041b57b7c76',
      name: 'Português Brasil',
      lang: 'pt',
      country: 'BR',
    },
  });

  terms[us.country].forEach(async (item: any) => seedTerm(us, item));
  terms[br.country].forEach(async (item: any) => seedTerm(br, item));

  await prisma.profile.upsert({
    where: { id: '9629aede-05c2-41d4-93cc-769f85f03d9a' },
    update: {},
    create: {
      id: '9629aede-05c2-41d4-93cc-769f85f03d9a',
      langId: us.id,
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
  });

  await prisma.profile.upsert({
    where: { id: '6a1da1d4-0b5a-4ecc-a09a-4cf2c380ede8' },
    update: {},
    create: {
      id: '6a1da1d4-0b5a-4ecc-a09a-4cf2c380ede8',
      langId: br.id,
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
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
