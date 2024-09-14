import { Injectable } from '@nestjs/common';
import { Configuration } from '@prisma/client';
import { PrismaService } from '@/shared/core/prisma.service';

@Injectable()
export class ConfigurationService {
  constructor(private readonly prismaService: PrismaService) {}

  async twoFactorAllowed(): Promise<boolean> {
    const configuration: Configuration = await this.prismaService.configuration.findFirst();
    return configuration.allow_two_factor;
  }

  async registerAllowed(): Promise<boolean> {
    const configuration: Configuration = await this.prismaService.configuration.findFirst();
    return configuration.allow_register;
  }
}
