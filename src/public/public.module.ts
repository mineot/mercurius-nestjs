import { Module } from '@nestjs/common';
import { PublicProfileService } from '@public/services/public-profile.service';
import { SharedModule } from '@shared/shared.module';

@Module({
  providers: [PublicProfileService],
  exports: [PublicProfileService],
  imports: [SharedModule],
})
export class PublicModule {}
