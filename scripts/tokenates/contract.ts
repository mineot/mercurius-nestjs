export enum Target {
  SECRET_KEY = 'secret_key',
  PUBLIC_TOKEN = 'public_token',
}

export enum Command {
  CREATE = 'create',
  GET = 'get',
  REVOKE = 'revoke',
  UNREVOKE = 'unrevoke',
  REMOVE = 'remove',
  REMOVE_EXPIRED = 'remove_expired',
}

export interface Tokenator {
  target: Target;
  cmd: Command;
  message?: string;
  issuer?: string;
  days?: number;
}
