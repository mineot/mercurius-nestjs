export interface GeneratedSecret {
  secret: string;
  otpauth_url: string;
}

export interface Verification {
  secret: string;
  token: string;
}
