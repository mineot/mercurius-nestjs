import { CryptoService } from '@/shared/core/crypto.service';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/core/prisma.service';

import {
  VerifyBy,
  FindBy,
  Finded,
  Exists,
  ValidatePassword,
  ValidPassword,
  Create,
  Created,
} from './contracts/user.contract';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cryptoService: CryptoService,
  ) {}

  async findBy(findBy: FindBy): Finded {
    return this.prismaService.user.findFirst({
      where: findBy,
    });
  }

  async exists(verifyBy: VerifyBy): Exists {
    const count: number = await this.prismaService.user.count({
      where: verifyBy,
    });

    return count > 0;
  }

  async validatePassword({ user, password }: ValidatePassword): ValidPassword {
    return (
      user &&
      this.cryptoService.compare({
        text: password,
        hash: user.password,
      })
    );
  }

  async create({ name, email, password }: Create): Created {
    return await this.prismaService.user.create({
      data: {
        id: undefined,
        twoFactorSecret: undefined,
        password: await this.cryptoService.hash({ text: password }),
        name,
        email,
      },
    });
  }
}
