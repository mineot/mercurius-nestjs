import { AppService } from '@/app.service';
import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common';
import { GetLanguage } from '@shared/decorators/language.decorator';
import { Language } from '@prisma/client';
import { PublicAccessGuard } from '@public/guards/public-access.guard';

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
