import { Module } from '@nestjs/common';

import { CryptoService } from '@/shared/utils/crypto.service';
import { PrismaService } from '@/shared/utils/prisma.service';

@Module({
  providers: [PrismaService, CryptoService],
  exports: [PrismaService, CryptoService],
})
export class SharedModule {}
