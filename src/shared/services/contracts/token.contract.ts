import { Token } from '@prisma/client';

export type Finded = Promise<Token>;

export interface FindBy {
  issuer?: string;
  revoked?: boolean;
}
