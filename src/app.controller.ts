import { Controller, Get, HttpCode } from '@nestjs/common';
import { AppService } from '@src/app.service';
import { GetLanguage } from '@shared/decorators/language.decorator';
import { Language } from '@prisma/client';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @HttpCode(200)
  index(@GetLanguage() language: Language): string {
    console.log(language);
    return this.appService.index();
  }
}
