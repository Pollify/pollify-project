import { Module } from '@nestjs/common';
import { LikeModule } from './like/like.module';

@Module({
  imports: [LikeModule],
})
export class AppModule {}
