import { Token } from '@prisma/client';

export type TokenFinded = Promise<Token>;

export interface FindToken {
  issuer?: string;
  revoked?: boolean;
}
