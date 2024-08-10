import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@shared/services/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async generateSignedUser(user: User): Promise<string> {
    return this.jwtService.signAsync({
      username: user.name,
      email: user.email,
      iss: 'user',
      sub: user.id,
      aud: 'admin',
      exp: 86400, //24hrs
    });
  }

  async verify(token: string): Promise<any> {
    return this.jwtService.verifyAsync(token);
  }
}
