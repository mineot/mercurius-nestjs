import { Injectable } from '@nestjs/common';
import { Language, Profile } from '@prisma/client';
import { PrismaService } from '@/shared/core/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private readonly prismaService: PrismaService) {}

  async fetch(language: Language): Promise<Profile> {
    return await this.prismaService.profile.findFirst({
      where: { langId: language.id },
    });
  }
}
