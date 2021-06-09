import { Module } from '@nestjs/common';
import { VoteModule } from 'src/vote/vote.module';
import { PollConsumer } from './poll.consumer';

@Module({
  imports: [VoteModule],
  controllers: [PollConsumer],
})
export class PollModule {}
