import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { PollConsumer } from './poll.consumer';

@Module({
  imports: [],
  controllers: [PollConsumer],
  providers: [],
})
export class PollModule {}
