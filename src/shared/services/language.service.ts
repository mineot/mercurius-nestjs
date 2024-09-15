import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core/prisma.service';

import { FindedAll } from './contracts/language.contract';

@Injectable()
export class LanguageService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): FindedAll {
    return this.prismaService.language.findMany();
  }
}
