import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common';
import { Language } from '@prisma/client';

import { AppService } from '@/app.service';
import { GetLanguage } from '@/shared/decorators/language.decorator';
import { PublicAccessGuard } from '@/shared/guards/public-access.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @HttpCode(200)
  @UseGuards(PublicAccessGuard)
  async index(@GetLanguage() language: Language): Promise<any> {
    return this.appService.fetchPublicData(language);
  }
}
