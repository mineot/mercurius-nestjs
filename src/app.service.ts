import { BadRequestException, Injectable } from '@nestjs/common';
import { Language, Profile } from '@prisma/client';
import { PrismaService } from '@shared/services/prisma.service';
import { TokenService } from '@shared/services/token.service';
import { AppTokenBody } from './app.params';

@Injectable()
export class AppService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly token: TokenService,
  ) {}

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

  async getProfile(language: Language): Promise<Profile> {
    const profile: Profile = await this.prisma.profile.findFirst({
      where: { langId: language.id },
    });

    return profile;
  }

  private badRequest(value: any, errorMessage: string) {
    if (!value) {
      throw new BadRequestException(errorMessage);
    }
  }
}
