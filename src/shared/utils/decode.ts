export class DecodeUtil {
  static extractToken(authorization: string): string {
    if (!authorization) {
      throw new Error('Token not found!');
    }

    const regex = /^Bearer\s+([A-Za-z0-9\-._~+/]+=*)$/;

    const match = authorization.match(regex);

    if (!match) {
      throw new Error('Invalid token!');
    }

    return match[1];
  }
}
