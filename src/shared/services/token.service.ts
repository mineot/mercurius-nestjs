import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@shared/services/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async generateSignedUser(user: User): Promise<string> {
    return this.jwt.signAsync({
      username: user.name,
      email: user.email,
      iss: 'user',
      sub: user.id,
      aud: 'admin',
      exp: 86400, //24hrs
    });
  }

  async verify(token: string): Promise<any> {
    return this.jwt.verifyAsync(token);
  }
}
