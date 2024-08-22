import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AdminModule } from '@/admin/admin.module';
import { AuthModule } from '@/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SharedModule } from '@/shared/shared.module';

import { LanguageInterceptor } from '@/shared/interceptors/language.interceptor';

@Module({
  imports: [
    AdminModule,
    AuthModule,
    SharedModule,
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {},
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
