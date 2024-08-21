import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as qrcode from 'qrcode';
import * as speakeasy from 'speakeasy';

import {
  GeneratedSecret,
  Verification,
} from '@/auth/contracts/two-factor.contract';

@Injectable()
export class TwoFactorService {
  async generateSecret(user: User): Promise<GeneratedSecret> {
    const secret = speakeasy.generateSecret({
      name: `Mercurius: ${user.email}`,
    });

    return {
      secret: secret.base32,
      otpauth_url: secret.otpauth_url,
    };
  }

  async generateQrCode(otpauthUrl: string): Promise<string> {
    return await qrcode.toDataURL(otpauthUrl);
  }

  async verifyToken({ secret, token }: Verification): Promise<boolean> {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
    });
  }
}
