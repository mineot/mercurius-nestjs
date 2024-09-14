import { UnauthorizedException } from '@nestjs/common';

export class DecodeUtil {
  static extractToken(authorization: string): string {
    if (!authorization) {
      throw new UnauthorizedException('Token not found!');
    }

    const regex = /^Bearer\s+([A-Za-z0-9\-._~+/]+=*)$/;

    const match = authorization.match(regex);

    if (!match) {
      throw new UnauthorizedException('Invalid token!');
    }

    return match[1];
  }
}
