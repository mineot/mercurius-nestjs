export const MessageContants = {
  INVALID_CREDENTIALS: 'Invalid credentials',
  REGISTER_NOT_ALLOWED: 'Register not allowed',
  TOKEN_NOT_FOUND_OR_REVOKED: 'Token not found or revoked',
  USER_ALREADY_EXISTS: 'User already exists',
  GUARD_PUBLIC_TOKEN: function (message: string): string {
    return `Guard Public Token: ${message}`;
  },
};
