import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CryptoService } from './crypto.service';

@Module({
  providers: [PrismaService, CryptoService],
  exports: [PrismaService],
})
export class SharedModule {}
