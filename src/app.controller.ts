import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { Language, Profile } from '@prisma/client';
import { AppService } from './app.service';
import { GetLanguage } from '@shared/decorators/language.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @HttpCode(200)
  async index(@GetLanguage() language: Language): Promise<Profile> {
    return this.appService.getProfile(language);
  }

  @Post('tokenator')
  async tokenator(@Body() body: any): Promise<any> {
    return this.appService.tokenator(body);
  }
}
