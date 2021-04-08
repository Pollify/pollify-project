import { Module } from '@nestjs/common';
import { PollModule } from './poll/poll.module';

@Module({
  imports: [PollModule],
})
export class AppModule {}
