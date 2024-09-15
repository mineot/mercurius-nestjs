import { FindBy, Finded } from './contracts/token.contract';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core/prisma.service';

@Injectable()
export class TokenService {
  constructor(private readonly prismaService: PrismaService) {}

  async findBy(findBy: FindBy): Finded {
    return this.prismaService.token.findFirst({
      where: findBy,
    });
  }
}
