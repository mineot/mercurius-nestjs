import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PublicModule } from './public/public.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [SharedModule, AdminModule, AuthModule, PublicModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
