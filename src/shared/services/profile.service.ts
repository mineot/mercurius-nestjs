import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/core/prisma.service';

import { FindBy, FindedBy } from './contracts/profile.contract';

@Injectable()
export class ProfileService {
  constructor(private readonly prismaService: PrismaService) {}

  async findBy(findBy: FindBy): FindedBy {
    return await this.prismaService.profile.findFirst({
      where: findBy,
    });
  }
}
