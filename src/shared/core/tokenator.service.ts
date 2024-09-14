import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { GenerateToken, TokenGenerated, TokenVerified, VerifyToken } from './contracts';

@Injectable()
export class TokenatorService {
  constructor(private readonly jwtService: JwtService) {}

  async create({ user }: GenerateToken): TokenGenerated {
    return {
      jwtToken: await this.jwtService.signAsync({
        email: user.email,
        sub: user.id,
        iss: 'user',
        aud: 'admin',
        exp: '1d',
      }),
    };
  }

  async verify({ token }: VerifyToken): TokenVerified {
    return this.jwtService.verifyAsync(token);
  }
}
