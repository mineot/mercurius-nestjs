import { Injectable } from '@nestjs/common';
import { ProfileService } from '@/shared/services/profile.service';
import { FetchPublicData, PublicData } from './app.contract';

@Injectable()
export class AppService {
  constructor(private readonly profile: ProfileService) {}

  async fetchPublicData({ language }: FetchPublicData): PublicData {
    return {
      profile: await this.profile.findBy({ langId: language.id }),
    };
  }
}
