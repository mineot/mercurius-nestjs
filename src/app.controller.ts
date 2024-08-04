import { AppService } from '@/app.service';
import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
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

  @Post('tokenator')
  async tokenator(@Body() body: any): Promise<any> {
    return this.appService.tokenator(body);
  }
}
