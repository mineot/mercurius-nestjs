import { userSeeder } from './seeds/users';
// import { SeedLanguages } from './seeds/languages';
// import { SeedTerms } from './seeds/terms';

async function Seeder() {
  await userSeeder.seed();
  // await SeedLanguages();
  // await SeedTerms();
}

Seeder();
