import { SeedUsers } from './seeds/users';
import { SeedLanguages } from './seeds/languages';
import { SeedTerms } from './seeds/terms';

async function Seeder() {
  await SeedUsers();
  await SeedLanguages();
  await SeedTerms();
}

Seeder();