import { User } from '@prisma/client';

export type Encrypted = Promise<string>;
export type Compared = Promise<boolean>;
export type TokenGenerated = Promise<{ jwtToken: string }>;

export type TokenVerified = Promise<{
  email: any;
  sub: any;
  iss: any;
  aud: any;
  exp: any;
}>;

export interface Hash {
  text: string;
}

export interface Compare {
  text: string;
  hash: string;
}

export interface GenerateToken {
  user: User;
}

export interface VerifyToken {
  token: string;
}
