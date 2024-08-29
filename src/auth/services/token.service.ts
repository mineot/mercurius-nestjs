import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class TokenService {
  constructor(private readonly jwt: JwtService) {}

  async generateSignedUser(user: User): Promise<string> {
    return this.jwt.signAsync({
      email: user.email,
      sub: user.id,
      iss: 'user',
      aud: 'admin',
      exp: '1d',
    });
  }

  async verify(token: string): Promise<any> {
    return this.jwt.verifyAsync(token);
  }
}
