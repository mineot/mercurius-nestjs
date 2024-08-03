import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@shared/services/prisma.service';
import { Token, User } from '@prisma/client';
import { v4 as uudid } from 'uuid';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async randomSecret(message: string): Promise<any> {
    const data = {
      id: uudid(),
      date: new Date().getDate(),
      message,
    };

    return { secret: btoa(JSON.stringify(data)) };
  }

  async generatePublicAccess(issuer: string): Promise<any> {
    const token: string = await this.jwt.signAsync({
      date: new Date().toISOString(),
      iss: issuer,
      sub: 'public_access',
      aud: 'guest',
    });

    await this.prisma.token.create({
      data: {
        id: undefined,
        value: token,
        issuer,
      },
    });

    return { public_access_token: token };
  }

  async revokePublicAccess(issuer: string, days: number): Promise<any> {
    const token: Token = await this.prisma.token.findFirst({
      where: { issuer },
    });

    if (token) {
      token.revoked = true;
      token.revoke_date = new Date();
      token.revoke_delay = days;

      await this.prisma.token.update({
        where: {
          id: token.id,
        },
        data: token,
      });

      return { revoked: true, issuer: token.issuer };
    }

    throw new NotFoundException('Public token not found');
  }

  async revokeShrink(): Promise<boolean> {
    return false;
  }

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
