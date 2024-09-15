import { User } from '@prisma/client';

export type Finded = Promise<User>;
export type Exists = Promise<boolean>;
export type ValidPassword = Promise<boolean>;
export type Created = Promise<User>;

export interface FindBy {
  email?: string;
}

export interface VerifyBy extends FindBy {}

export interface ValidatePassword {
  user: User;
  password: string;
}

export interface Create {
  email: string;
  name: string;
  password: string;
}
