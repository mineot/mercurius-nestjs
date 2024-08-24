import { userSeeder } from './seeds/users';
import { languagesSeeder } from './seeds/languages';
import { termsSeeder } from './seeds/terms';
import { profilesSeeder } from './seeds/profiles';
import { configurationSeeder } from './seeds/configurations';

async function seeders(): Promise<void> {
  await userSeeder();
  await languagesSeeder();
  await termsSeeder();
  await profilesSeeder();
  await configurationSeeder();
}

seeders();
