import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { VoteConsumer } from './vote.consumer';
import { VoteController } from './vote.controller';
import { VoteService } from './vote.service';
import { Votable } from './schemas/votable.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'votable', schema: Votable }])],
  controllers: [VoteController, VoteConsumer],
  providers: [
    VoteService,
    {
      provide: 'KAFKA_SERVICE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'vote-service',
              brokers: [configService.get('KAFKA_CLUSTER')],
            },
            consumer: {
              groupId: 'vote-service-consumer',
            },
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [VoteService],
})
export class VoteModule {}
