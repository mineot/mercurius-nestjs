export interface AppTokenBody {
  target:
    | 'random_secret'
    | 'public_access'
    | 'revoke_public_access'
    | 'revokes_shrink';
  message?: string;
  issuer?: string;
  days?: number;
}
