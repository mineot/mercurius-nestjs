import { Module } from '@nestjs/common';
import { AuthController } from '@/auth/auth.controller';

import { SignerService } from '@/auth/services/signer.service';
import { TokenService } from '@/auth/services/token.service';
import { TwoFactorController } from '@/auth/two-factor.controller';
import { TwoFactorService } from '@/auth/services/two-factor.service';

@Module({
  providers: [TokenService, SignerService, TwoFactorService],
  controllers: [AuthController, TwoFactorController],
})
export class AuthModule {}
