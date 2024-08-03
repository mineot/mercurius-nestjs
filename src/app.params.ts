export interface AppTokenBody {
  target:
    | 'random_secret'
    | 'public_access'
    | 'get_public_access'
    | 'revoke_public_access'
    | 'revoke_shrink';
  message?: string;
  issuer?: string;
  days?: number;
}
