import { Profile } from '@prisma/client';

export type FindedBy = Promise<Profile>;

export interface FindBy {
  langId?: string;
}
