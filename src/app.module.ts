import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AdminModule } from '@admin/admin.module';
import { AuthModule } from '@auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PublicModule } from '@public/public.module';
import { SharedModule } from '@shared/shared.module';

import { LanguageInterceptor } from '@shared/interceptors/language.interceptor';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    AdminModule,
    AuthModule,
    PublicModule,
    SharedModule,
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {},
    }),
  ],
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
