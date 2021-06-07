import { Module } from '@nestjs/common';
import { PollModule } from 'src/poll/poll.module';
import { DiscordModule } from '../discord/discord.module';
import { PollHandler } from './poll/poll.handler';
import { ReactionsService } from './reactions.service';

@Module({
  imports: [DiscordModule, PollModule],
  providers: [ReactionsService, PollHandler],
  exports: [ReactionsService],
})
export class ReactionsModule {}
