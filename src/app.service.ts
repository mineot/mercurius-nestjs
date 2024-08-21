import { Injectable } from '@nestjs/common';
import { Language } from '@prisma/client';
import { ProfileService } from '@/shared/services/profile.service';

@Injectable()
export class AppService {
  constructor(private readonly profile: ProfileService) {}

  async fetchPublicData(language: Language): Promise<any> {
    return {
      profile: await this.profile.fetch(language),
    };
  }
}
