import { Module } from '@nestjs/common';

import { CryptoService } from '@/shared/core/crypto.service';
import { PrismaService } from '@/shared/core/prisma.service';
import { ProfileService } from '@/shared/services/profile.service';

@Module({
  providers: [PrismaService, CryptoService, ProfileService],
  exports: [PrismaService, CryptoService, ProfileService],
})
export class SharedModule {}
