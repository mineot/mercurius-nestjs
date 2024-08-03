import { Injectable } from '@nestjs/common';
import { Language, Profile } from '@prisma/client';
import { PrismaService } from '@src/shared/services/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async index(language: Language): Promise<Profile> {
    const profile: Profile = await this.prisma.profile.findFirst({
      where: { langId: language.id },
    });

    return profile;
  }
}
