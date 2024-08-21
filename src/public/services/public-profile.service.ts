import { Injectable } from '@nestjs/common';
import { Language, Profile } from '@prisma/client';
import { PrismaService } from '@/shared/utils/prisma.service';

@Injectable()
export class PublicProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async fetch(language: Language): Promise<Profile> {
    const profile: Profile = await this.prisma.profile.findFirst({
      where: { langId: language.id },
    });

    return profile;
  }
}
