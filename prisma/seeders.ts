import { userSeeder } from './seeds/users';
import { languagesSeeder } from './seeds/languages';
import { termsSeeder } from './seeds/terms';

async function seeders(): Promise<void> {
  await userSeeder();
  await languagesSeeder();
  await termsSeeder();
}

seeders();
