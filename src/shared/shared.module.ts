import { Module } from '@nestjs/common';

import { CryptoService } from '@shared/services/crypto.service';
import { PrismaService } from '@shared/services/prisma.service';

@Module({
  providers: [PrismaService, CryptoService],
  exports: [PrismaService, CryptoService],
})
export class SharedModule {}
