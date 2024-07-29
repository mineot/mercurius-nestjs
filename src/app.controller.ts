import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './shared/prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
