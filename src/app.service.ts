import { AppTokenBody } from '@/app.params';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Language } from '@prisma/client';
import { ProfileService } from '@public/profile.service';
import { TokenService } from '@shared/services/token.service';

@Injectable()
export class AppService {
  constructor(
    private readonly token: TokenService,
    private readonly profile: ProfileService,
  ) {}

  async fetchPublicData(language: Language): Promise<any> {
    return {
      profile: await this.profile.fetch(language),
    };
  }

  async tokenator(params: AppTokenBody): Promise<any> {
    const { target, message, issuer, days } = params;

    switch (target) {
      case 'random_secret':
        this.badRequest(message, 'The attribute "message" is required');
        return this.token.randomSecret(params.message);
      case 'public_access':
        this.badRequest(issuer, 'The attribute "issuer" is required');
        return this.token.generatePublicAccess(issuer);
      case 'get_public_access':
        this.badRequest(issuer, 'The attribute "issuer" is required');
        return this.token.getPublicAccess(issuer);
      case 'revoke_public_access':
        this.badRequest(issuer, 'The attribute "issuer" is required');
        this.badRequest(days, 'The attribute "days" is required');
        return this.token.revokePublicAccess(issuer, days);
      case 'revoke_shrink':
        return this.token.revokeShrink();
      default:
        this.badRequest(undefined, 'Invalid target');
        break;
    }
  }

  private badRequest(value: any, errorMessage: string) {
    if (!value) {
      throw new BadRequestException(errorMessage);
    }
  }
}
