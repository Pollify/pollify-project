import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { PollConsumer } from './poll.consumer';
import { PollController } from './poll.controller';
import { PollService } from './poll.service';
import { Poll } from './schemas/poll.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'poll', schema: Poll }])],
  controllers: [PollController, PollConsumer],
  providers: [
    PollService,
    {
      provide: 'POLL_SERVICE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'poll-service',
              brokers: [configService.get('KAFKA_CLUSTER')],
            },
            consumer: {
              groupId: 'poll-service',
            },
          },
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class PollModule {}
