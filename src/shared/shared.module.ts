import { Module } from '@nestjs/common';
import { PrismaService } from '@shared/services/prisma.service';
import { CryptoService } from '@shared/services/crypto.service';

@Module({
  providers: [PrismaService, CryptoService],
  exports: [PrismaService, CryptoService],
})
export class SharedModule {}
