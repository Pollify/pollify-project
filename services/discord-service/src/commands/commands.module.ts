import { HttpModule, Module } from '@nestjs/common';

import { DiscordModule } from '../discord/discord.module';
import { CommandsService } from './commands.service';

import { PingHandler } from './ping/ping.handler';
import { InviteHandler } from './invite/invite.handler';
import { HelpHandler } from './help/help.handler';
import { StatusHandler } from './status/status.handler';
import { PollSubscriptionHandler } from './poll-subscription/poll-subscription.handler';
import { ServerModule } from 'src/server/server.module';
import { JokeHandler } from './joke/joke.handler';

@Module({
  imports: [DiscordModule, ServerModule, HttpModule],
  providers: [
    CommandsService,
    PollSubscriptionHandler,
    PingHandler,
    JokeHandler,
    InviteHandler,
    StatusHandler,
    {
      provide: HelpHandler,
      useFactory: (
        pollSubscriptionHandler: PollSubscriptionHandler,
        pingHandler: PingHandler,
        statusHandler: StatusHandler,
        jokeHandler: JokeHandler,
        inviteHandler: InviteHandler,
      ) => {
        return new HelpHandler([
          pollSubscriptionHandler,
          pingHandler,
          statusHandler,
          inviteHandler,
          jokeHandler,
        ]);
      },
      inject: [
        PollSubscriptionHandler,
        PingHandler,
        StatusHandler,
        JokeHandler,
        InviteHandler,
      ],
    },
  ],
  exports: [CommandsService],
})
export class CommandsModule {}
