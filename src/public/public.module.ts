import { Module } from '@nestjs/common';
import { PublicProfileService } from './services/public-profile.service';
import { SharedModule } from '@shared/shared.module';
import { PublicTokenService } from './services/public-token.service';

@Module({
  providers: [PublicProfileService, PublicTokenService],
  exports: [PublicProfileService, PublicTokenService],
  imports: [SharedModule],
})
export class PublicModule {}
