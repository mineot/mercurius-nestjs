import { Module } from '@nestjs/common';

import { CryptoService } from '@shared/services/crypto.service';
import { PrismaService } from '@shared/services/prisma.service';
import { TokenService } from '@shared/services/token.service';

@Module({
  providers: [PrismaService, CryptoService, TokenService],
  exports: [PrismaService, CryptoService, TokenService],
})
export class SharedModule {}
