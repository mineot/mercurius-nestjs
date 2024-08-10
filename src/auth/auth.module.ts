import { Module } from '@nestjs/common';
import { AuthTokenService } from '@auth/services/auth-token.service';

@Module({
  providers: [AuthTokenService],
  exports: [AuthTokenService],
})
export class AuthModule {}
