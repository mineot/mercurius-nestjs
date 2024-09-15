import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { DecodeUtil } from '../utils/decode';
import { MessageContants } from '../constants/messages.contant';
import { Token } from '@prisma/client';
import { TokenService } from '@/shared/services/token.service';
import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';

dotenv.config();

@Injectable()
export class PublicAccessGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const bearer: string = DecodeUtil.extractToken(request.headers.authorization);

      const payload: any = jwt.verify(bearer, process.env.JWT_SECRET, {
        algorithms: ['HS512'],
        ignoreExpiration: true,
      });

      const token: Token = await this.tokenService.findBy({
        issuer: payload.iss,
        revoked: false,
      });

      if (!token) {
        throw new Error(MessageContants.TOKEN_NOT_FOUND_OR_REVOKED);
      }

      return true;
    } catch (err) {
      throw new UnauthorizedException(MessageContants.GUARD_PUBLIC_TOKEN(err.message));
    }
  }
}
