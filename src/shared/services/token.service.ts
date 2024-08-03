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
      token.revoke_at = new Date();
      token.revoke_days = days;

      await this.prisma.token.update({
        where: {
          id: token.id,
        },
        data: token,
      });

      return {
        revoked: true,
        remove_at: token.revoke_at,
        remove_days: token.revoke_days,
        issuer: token.issuer,
      };
    }

    throw new NotFoundException('Public token not found');
  }

  async getPublicAccess(issuer: string): Promise<any> {
    const token: Token = await this.prisma.token.findFirst({
      where: { issuer },
    });

    return { public_access_token: token.value, issuer };
  }

  async revokeShrink(): Promise<any> {
    const today = new Date();

    let tokens: Token[] = await this.prisma.token.findMany({
      where: { revoked: true },
    });

    tokens = tokens.filter((token: Token) => {
      const diff = Math.abs(today.getTime() - token.revoke_at.getTime());
      const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
      return diffDays > token.revoke_days;
    });

    for (const token of tokens) {
      await this.prisma.token.delete({
        where: { id: token.id },
      });
    }

    return {
      deleted_tokens: tokens.map((token: Token) => ({
        issuer: token.issuer,
        revoke_at: token.revoke_at,
      })),
    };
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
