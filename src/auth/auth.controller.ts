import { Controller, Post } from '@nestjs/common';
import { TwoFactorService } from '@auth/services/two-factor.service';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly twoFactorAuthService: TwoFactorService) {}

  // TODO finish this implementation
  @Post('2fa/enable')
  async enable2fa() {
    const { secret, otpauth_url } =
      await this.twoFactorAuthService.generateSecret(null);

    const qrCode = await this.twoFactorAuthService.generateQrCode(otpauth_url);

    // Store secret in database

    return { secret, qrCode };
  }

  // TODO finish this implementation
  @Post('2fa/enable/verify')
  async enableVerify2fa() {
    const isValid = this.twoFactorAuthService.verifyToken({
      secret: 'secret',
      token: 'token',
    });

    return { isValid };
  }
}
