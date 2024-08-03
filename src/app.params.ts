export interface AppTokenBody {
  target: 'random_secret' | 'public_access';
  message?: string;
  issuer?: string;
}
