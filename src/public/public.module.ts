import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { SharedModule } from '@shared/shared.module';

@Module({
  providers: [ProfileService],
  exports: [ProfileService],
  imports: [SharedModule],
})
export class PublicModule {}
