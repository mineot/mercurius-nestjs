import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { DecodeUtil } from '../utils/decode';
import { PrismaService } from '@/shared/core/prisma.service';
import { Token } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';

dotenv.config();

@Injectable()
export class PublicAccessGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const bearer: string = DecodeUtil.extractToken(request.headers.authorization);

      const payload: any = jwt.verify(bearer, process.env.JWT_SECRET, {
        algorithms: ['HS512'],
        ignoreExpiration: true,
      });

      const token: Token = await this.prisma.token.findFirst({
        where: {
          issuer: payload.iss,
          revoked: false,
        },
      });

      if (!token) {
        throw new Error('Token register not found or revoked');
      }

      return true;
    } catch (err) {
      throw new UnauthorizedException(`Public token guard: ${err.message}`);
    }
  }
}
