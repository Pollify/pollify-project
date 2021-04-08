import { Injectable } from '@nestjs/common';
import { Client, Message, MessageEmbed } from 'discord.js';
import Logger from '@pollify/logger';

import { ICommandHandler } from './interfaces/ICommandHandler';

import { PingHandler } from './ping/ping.handler';
import { InviteHandler } from './invite/invite.handler';
import { HelpHandler } from './help/help.handler';
import { StatusHandler } from './status/status.handler';
import { PollSubscriptionHandler } from './poll-subscription/poll-subscription.handler';

@Injectable()
export class CommandsService {
  commandHandlers: ICommandHandler[] = [];

  constructor(
    pollSubscriptionHandler: PollSubscriptionHandler,
    pingHandler: PingHandler,
    inviteHandler: InviteHandler,
    helpHandler: HelpHandler,
    statusHandler: StatusHandler,
  ) {
    this.commandHandlers = [
      pollSubscriptionHandler,
      pingHandler,
      inviteHandler,
      helpHandler,
      statusHandler,
    ];
  }

  register(client: Client) {
    client.on('message', async (message) => {
      await this.messageHandler(message);
    });
  }

  async messageHandler(message: Message) {
    if (message.author.bot) return;

    const prefixRegexp = new RegExp(
      `^(${this.escapePrefixForRegexp('!')})`,
      'i',
    );

    if (prefixRegexp.test(message.content)) {
      message.content = message.content.replace(prefixRegexp, '').trim();
    }

    for (const handler of this.commandHandlers) {
      if (handler.test(message.content)) {
        try {
          await handler.execute(message);
        } catch (error) {
          Logger.error(error.message);

          message.channel.send(
            new MessageEmbed()
              .setColor('RED')
              .setDescription(
                'Something went wrong with executing your command',
              ),
          );
        }
      }
    }
  }

  private escapePrefixForRegexp(serverPrefix: string): string {
    return './+\\*!?)([]{}^$'.split('').includes(serverPrefix[0])
      ? `\\${serverPrefix}`
      : serverPrefix;
  }
}
