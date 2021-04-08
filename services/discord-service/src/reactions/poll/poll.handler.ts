import { Injectable } from '@nestjs/common';
import { Message, MessageEmbed } from 'discord.js';
import { IReactionHandler } from '../interfaces/ICommandHandler';

@Injectable()
export class PollHandler implements IReactionHandler {
  constructor() {}

  test(test: string): boolean {
    return true;
  }

  async execute(message: Message): Promise<void> {
    message.channel.send('good job');
  }
}
