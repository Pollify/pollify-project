import { Injectable } from '@nestjs/common';
import { Guild, Message, MessageEmbed } from 'discord.js';
import { ServerService } from 'src/server/server.service';

import { ICommandHandler } from '../interfaces/ICommandHandler';

@Injectable()
export class PollSubscriptionHandler implements ICommandHandler {
  constructor(private readonly serverService: ServerService) {}

  name = 'poll-subscription';
  regex = new RegExp(`^${this.name}`, 'i');
  description = 'Sends the poll subscription status of the channel';

  test(content: string): boolean {
    return this.regex.test(content);
  }

  async execute(message: Message): Promise<void> {
    this.serverService.administratorRoleGaurd(message.guild, message.author.id);

    switch (this.getExtraArguments(message.content)[0]) {
      case '':
        this.handleSubscriptionStatus(message);
        break;

      case 'on':
        this.handleChannelSubscribe(message);
        break;

      case 'off':
        this.handleChannelUnsubscribe(message);
        break;

      default:
        message.channel.send(
          new MessageEmbed()
            .setColor('RED')
            .setDescription(
              'Invalid parameter, use `!help` to receive information about commands',
            ),
        );
        break;
    }
  }

  private async handleSubscriptionStatus(message: Message): Promise<void> {
    message.channel.send(
      new MessageEmbed()
        .setColor('GREEN')
        .setDescription(
          (await this.serverService.isChannelSubscribedToPolls(
            message.guild,
            message.channel,
          ))
            ? 'This channel is subscribed to polls'
            : 'This channel is not subscribed to polls',
        ),
    );
  }

  private async handleChannelSubscribe(message: Message): Promise<void> {
    const server = await this.serverService.subscribeChannelToPolls(
      message.guild,
      message.channel,
    );

    message.channel.send(
      new MessageEmbed()
        .setColor('GREEN')
        .setDescription('Successfully subscribed this channel to polls')
        .addField(
          'All subscribed channels:',
          this.getChannelNames(
            message.guild,
            server.channelsSubscribedToPolls,
          ).join('\n'),
        ),
    );
  }

  private async handleChannelUnsubscribe(message: Message): Promise<void> {
    const server = await this.serverService.unsubscribeChannelToPolls(
      message.guild,
      message.channel,
    );

    const subscribedChannelNames = this.getChannelNames(
      message.guild,
      server.channelsSubscribedToPolls,
    );

    message.channel.send(
      new MessageEmbed()
        .setColor('GREEN')
        .setDescription('Successfully unsubscribed this channel from polls')
        .addField(
          'All subscribed channels:',
          subscribedChannelNames.length
            ? subscribedChannelNames.join('\n')
            : 'None',
        ),
    );
  }

  private getExtraArguments(command: string): string[] {
    return command.slice(this.name.length).trim().split(' ');
  }

  private getChannelNames(guild: Guild, channelIds: string[]): string[] {
    return channelIds.map(
      (channelId) => guild.channels.cache.get(channelId)?.name,
    );
  }
}
