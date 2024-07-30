import { Injectable } from '@nestjs/common';
import { PrismaService } from './shared/prisma.service';
import { CryptoService } from './shared/crypto.service';
import { User } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(
    private prisma: PrismaService,
    private crypto: CryptoService,
  ) {}

  index(): string {
    return 'Hello World!';
  }

  async users(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async encrypt(): Promise<string> {
    return await this.crypto.encrypt('Text to encrypt');
  }

  async compare(): Promise<boolean> {
    const text = 'Text to encrypt';
    const hash = await this.crypto.encrypt(text);
    return await this.crypto.compare(text, hash);
  }
}
