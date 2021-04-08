import { Module } from '@nestjs/common';

import { DiscordModule } from '../discord/discord.module';
import { PollHandler } from './poll/poll.handler';
import { ReactionsService } from './reactions.service';

@Module({
  imports: [DiscordModule],
  providers: [ReactionsService, PollHandler],
  exports: [ReactionsService],
})
export class ReactionsModule {}
