import { Module } from '@nestjs/common';
import { AuthController } from '@auth/auth.controller';
import { SignerService } from '@auth/services/signer.service';
import { TokenService } from '@auth/services/token.service';

@Module({
  providers: [TokenService, SignerService],
  controllers: [AuthController],
})
export class AuthModule {}
