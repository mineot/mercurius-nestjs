import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from '@prisma/client';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  index(): string {
    return this.appService.index();
  }

  @Get('/users')
  users(): Promise<User[]> {
    return this.appService.users();
  }

  @Get('/encrypt')
  encrypt(): Promise<string> {
    return this.appService.encrypt();
  }

  @Get('/compare')
  compare(): Promise<boolean> {
    return this.appService.compare();
  }
}
