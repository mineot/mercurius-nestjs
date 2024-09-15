import { Language, Profile } from '@prisma/client';

export type PublicData = Promise<{
  profile: Profile;
}>;

export interface FetchPublicData {
  language: Language;
}
