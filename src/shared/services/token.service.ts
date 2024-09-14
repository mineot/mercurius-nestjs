import { FindToken, TokenFinded } from './token.contract';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core/prisma.service';

@Injectable()
export class TokenService {
  constructor(private readonly prismaService: PrismaService) {}

  async findTokenBy({ issuer, revoked }: FindToken): TokenFinded {
    return this.prismaService.token.findFirst({
      where: {
        issuer,
        revoked,
      },
    });
  }
}
