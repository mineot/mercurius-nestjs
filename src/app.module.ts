import { Module } from '@nestjs/common';
import { AppController } from '@src/app.controller';
import { AppService } from '@src/app.service';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { AdminModule } from '@admin/admin.module';
import { AuthModule } from '@auth/auth.module';
import { PublicModule } from '@public/public.module';
import { SharedModule } from '@shared/shared.module';

import { LanguageInterceptor } from '@shared/interceptors/language.interceptor';

@Module({
  imports: [SharedModule, AdminModule, AuthModule, PublicModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LanguageInterceptor,
    },
  ],
})
export class AppModule {}
