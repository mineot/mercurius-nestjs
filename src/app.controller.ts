import { Controller, Get, HttpCode } from '@nestjs/common';
import { AppService } from '@src/app.service';
import { GetLanguage } from '@shared/decorators/language.decorator';
import { Language, Profile } from '@prisma/client';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @HttpCode(200)
  async index(@GetLanguage() language: Language): Promise<Profile> {
    return this.appService.index(language);
  }
}
