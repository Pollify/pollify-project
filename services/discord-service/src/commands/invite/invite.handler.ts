import { Injectable } from '@nestjs/common';
import { Message, MessageEmbed } from 'discord.js';

import { ICommandHandler } from '../interfaces/ICommandHandler';
import { DiscordService } from '../../discord/discord.service';

@Injectable()
export class InviteHandler implements ICommandHandler {
  constructor(private readonly discordService: DiscordService) {}

  name = 'invite';
  regex = new RegExp(`^invite$`, 'i');
  description = 'Send an invite link for this awesome bot!';

  test(content: string): boolean {
    return this.regex.test(content);
  }

  async execute(message: Message): Promise<void> {
    const embed = new MessageEmbed()
      .setDescription(this.discordService.getBotInviteLink())
      .setColor('BLUE');
    message.channel.send(embed);
  }
}
