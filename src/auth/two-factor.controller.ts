import { Controller, Post } from '@nestjs/common';
import { TwoFactorService } from './services/two-factor.service';

@Controller('2fa')
export class TwoFactorController {
  constructor(private readonly twoFactorAuthService: TwoFactorService) {}

  // TODO finish this implementation
  @Post('enable')
  async enable2fa() {
    const { secret, otpauth_url } = await this.twoFactorAuthService.generateSecret(null);
    const qrCode = await this.twoFactorAuthService.generateQrCode(otpauth_url);
    // Store secret in database
    return { secret, qrCode };
  }

  // TODO finish this implementation
  @Post('verify')
  async enableVerify2fa() {
    const isValid = this.twoFactorAuthService.verifyToken({
      secret: 'secret',
      token: 'token',
    });

    return { isValid };
  }
}
