import { Module } from '@nestjs/common';
import { AuthController } from '@/auth/auth.controller';

import { AuthService } from '@/auth/services/auth.service';
import { AbcService } from '@/shared/core/abc.service';
import { TwoFactorController } from '@/auth/two-factor.controller';
import { TwoFactorService } from '@/auth/services/two-factor.service';

@Module({
  providers: [AbcService, AuthService, TwoFactorService],
  controllers: [AuthController, TwoFactorController],
})
export class AuthModule {}
