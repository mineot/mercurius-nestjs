import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/shared/services/prisma.service';
import { Token } from '@prisma/client';
import { Tokenator } from '@public/models/tokenator.model';

@Injectable()
export class PublicTokenService {
  constructor(private readonly prismaService: PrismaService) {}

  async recoveryPublicAccess({ issuer }: Tokenator): Promise<any> {
    const token: Token = await this.prismaService.token.findFirst({
      where: { issuer, revoked: false },
    });

    if (!token) {
      throw new NotFoundException(`Token not found for issuer ${issuer}`);
    }

    return {
      issuer,
      public_access_token: token.value,
      recovered_at: new Date(),
    };
  }

  async revokePublicAccess({ issuer, days }: Tokenator): Promise<any> {
    const token: Token = await this.prismaService.token.findFirst({
      where: { issuer },
    });

    if (!token) {
      throw new NotFoundException(`Token not found for issuer: ${issuer}`);
    }

    token.revoked = true;
    token.revoke_at = new Date();
    token.revoke_days = days;

    await this.prismaService.token.update({
      where: { id: token.id },
      data: token,
    });

    return {
      revoked: true,
      revoke_at: token.revoke_at,
      revoke_days: token.revoke_days,
      issuer: token.issuer,
    };
  }

  async removeExpiredTokens(): Promise<any> {
    const today = new Date();

    let tokens: Token[] = await this.prismaService.token.findMany({
      where: { revoked: true },
    });

    tokens = tokens.filter((token: Token) => {
      const diff = Math.abs(today.getTime() - token.revoke_at.getTime());
      const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
      return diffDays > token.revoke_days;
    });

    for (const token of tokens) {
      await this.prismaService.token.delete({
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
}
