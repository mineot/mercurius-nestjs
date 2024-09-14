import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '@/shared/core/prisma.service';
import { CryptoService } from '@/shared/core/crypto.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cryptoService: CryptoService,
  ) {}

  async findUserByEmail(email: string): Promise<User> {
    return this.prismaService.user.findFirst({
      where: { email },
    });
  }

  async checkUserExistsByEmail(email: string): Promise<boolean> {
    const exists: number = await this.prismaService.user.count({
      where: { email },
    });

    return exists === 1;
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return user && this.cryptoService.compare(password, user.password);
  }

  async create({ name, email, password }): Promise<User> {
    return await this.prismaService.user.create({
      data: {
        id: undefined,
        twoFactorSecret: undefined,
        password: await this.cryptoService.hash(password),
        name,
        email,
      },
    });
  }
}
