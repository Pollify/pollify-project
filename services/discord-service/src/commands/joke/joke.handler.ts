import { HttpService, Injectable } from '@nestjs/common';
import { Message, MessageEmbed } from 'discord.js';

import { ICommandHandler } from '../interfaces/ICommandHandler';

@Injectable()
export class JokeHandler implements ICommandHandler {
  constructor(private readonly httpService: HttpService) {}

  name = 'joke';
  regex = new RegExp(`^${this.name}$`, 'i');
  description = 'Sends you an amazing joke!';

  test(content: string): boolean {
    return this.regex.test(content);
  }

  async execute(message: Message): Promise<void> {
    await message.channel.send(
      new MessageEmbed()
        .setColor('GREEN')
        .setDescription(
          (
            await this.httpService
              .get('https://v2.jokeapi.dev/joke/Any?format=txt')
              .toPromise()
          ).data,
        ),
    );
  }
}
