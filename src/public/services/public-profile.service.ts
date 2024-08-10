import { PrismaService } from '@shared/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { Language, Profile } from '@prisma/client';

@Injectable()
export class PublicProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async fetch(lang: Language): Promise<Profile> {
    const profile: Profile = await this.prisma.profile.findFirst({
      where: { langId: lang.id },
    });

    console.log(profile);

    return profile;
  }
}
