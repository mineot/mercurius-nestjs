import { AppService } from '@/app.service';
import { Controller, Get, HttpCode } from '@nestjs/common';
import { GetLanguage } from '@shared/decorators/language.decorator';
import { Language } from '@prisma/client';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @HttpCode(200)
  async index(@GetLanguage() language: Language): Promise<any> {
    return this.appService.fetchPublicData(language);
  }
}
