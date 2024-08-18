import { Injectable } from '@nestjs/common';
import { Language } from '@prisma/client';
import { PublicProfileService } from '@/public/services/public-profile.service';

@Injectable()
export class AppService {
  constructor(private readonly profile: PublicProfileService) {}

  async fetchPublicData(language: Language): Promise<any> {
    return {
      profile: await this.profile.fetch(language),
    };
  }
}
