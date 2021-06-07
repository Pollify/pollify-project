import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServerModule } from 'src/server/server.module';
import { PollConsumer } from './poll.consumer';
import { PollService } from './poll.service';
import { Poll } from './schemas/poll.schema';

@Module({
  imports: [
    ServerModule,
    MongooseModule.forFeature([{ name: 'poll', schema: Poll }]),
  ],
  controllers: [PollConsumer],
  providers: [PollService],
  exports: [PollService],
})
export class PollModule {}
