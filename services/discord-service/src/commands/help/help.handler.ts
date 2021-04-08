import { Injectable } from '@nestjs/common';
import { EmbedFieldData, Message, MessageEmbed } from 'discord.js';

import { ICommandHandler } from '../interfaces/ICommandHandler';
import { InviteHandler } from '../invite/invite.handler';
import { PingHandler } from '../ping/ping.handler';
import { PollSubscriptionHandler } from '../poll-subscription/poll-subscription.handler';
import { StatusHandler } from '../status/status.handler';

@Injectable()
export class HelpHandler implements ICommandHandler {
  constructor(private readonly commandHandlers: ICommandHandler[]) {}

  name = 'help';
  regex = new RegExp('^help', 'i');
  description = 'Displays the help message';

  test(content: string): boolean {
    return this.regex.test(content);
  }

  async execute(message: Message): Promise<void> {
    const prefix = '!';

    const embed = new MessageEmbed().setDescription('Pollify help').addFields([
      {
        name: `${prefix}${this.name}`,
        value: this.description,
      },
      ...this.commandHandlers.map(
        (handler) =>
          <EmbedFieldData>{
            name: `${prefix}${handler.name}`,
            value: handler.description,
          },
      ),
    ]);

    message.channel.send(embed);
  }
}
