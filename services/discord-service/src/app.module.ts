import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { DiscordModule } from './discord/discord.module';
import { CommandsModule } from './commands/commands.module';
import { ReactionsModule } from './reactions/reactions.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PollModule } from './poll/poll.module';

@Module({
  imports: [
    DiscordModule,
    CommandsModule,
    ReactionsModule,
    PollModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
