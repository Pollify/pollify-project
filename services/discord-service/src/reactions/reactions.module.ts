import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { PollModule } from 'src/poll/poll.module';
import { DiscordModule } from '../discord/discord.module';
import { PollHandler } from './poll/poll.handler';
import { ReactionsService } from './reactions.service';

@Module({
  imports: [DiscordModule, PollModule, ConfigModule],
  providers: [
    ReactionsService,
    PollHandler,
    {
      provide: 'KAFKA_SERVICE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'discord-service',
              brokers: [configService.get('KAFKA_CLUSTER')],
            },
            consumer: {
              groupId: 'discord-service-consumer',
            },
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [ReactionsService],
})
export class ReactionsModule {}
