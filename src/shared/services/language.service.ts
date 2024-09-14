import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core/prisma.service';
import { Language } from '@prisma/client';

@Injectable()
export class LanguageService {
  constructor(private readonly prismaService: PrismaService) {}

  async fetchAll(): Promise<Language[]> {
    return this.prismaService.language.findMany();
  }
}
