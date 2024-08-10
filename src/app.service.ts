import { Injectable, NotFoundException } from '@nestjs/common';
import { Language } from '@prisma/client';
import { PublicProfileService } from '@/public/services/public-profile.service';
import { PublicTokenService } from '@public/services/public-token.service';
import { Tokenator } from './public/models/tokenator.model';

@Injectable()
export class AppService {
  constructor(
    private readonly publicToken: PublicTokenService,
    private readonly profile: PublicProfileService,
  ) {}

  async fetchPublicData(language: Language): Promise<any> {
    return {
      profile: await this.profile.fetch(language),
    };
  }

  async tokenator(args: Tokenator): Promise<any> {
    if (args.randomSecret) {
      return this.publicToken.randomSecret(args);
    } else if (args.createPublicAccess) {
      return this.publicToken.createPublicAccess(args);
    } else if (args.recoveryPublicAccess) {
      return this.publicToken.recoveryPublicAccess(args);
    } else if (args.revokePublicAccess) {
      return this.publicToken.revokePublicAccess(args);
    } else if (args.removeExpiredTokens) {
      return this.publicToken.removeExpiredTokens();
    } else {
      throw new NotFoundException('invalid_tokenator');
    }
  }
}
