import { Module } from '@nestjs/common';

import { DiscordModule } from '../discord/discord.module';
import { CommandsService } from './commands.service';

import { PingHandler } from './ping/ping.handler';
import { InviteHandler } from './invite/invite.handler';
import { HelpHandler } from './help/help.handler';
import { StatusHandler } from './status/status.handler';
import { PollSubscriptionHandler } from './poll-subscription/poll-subscription.handler';
import { ServerModule } from 'src/server/server.module';

@Module({
  imports: [DiscordModule, ServerModule],
  providers: [
    CommandsService,
    PollSubscriptionHandler,
    PingHandler,
    InviteHandler,
    StatusHandler,
    {
      provide: HelpHandler,
      useFactory: (
        pollSubscriptionHandler: PollSubscriptionHandler,
        pingHandler: PingHandler,
        statusHandler: StatusHandler,
        inviteHandler: InviteHandler,
      ) => {
        return new HelpHandler([
          pollSubscriptionHandler,
          pingHandler,
          statusHandler,
          inviteHandler,
        ]);
      },
      inject: [
        PollSubscriptionHandler,
        PingHandler,
        StatusHandler,
        InviteHandler,
      ],
    },
  ],
  exports: [CommandsService],
})
export class CommandsModule {}
