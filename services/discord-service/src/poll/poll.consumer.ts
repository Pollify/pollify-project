import { Controller } from '@nestjs/common';
import Logger from '@pollify/logger';
import { EventPattern, Payload } from '@nestjs/microservices';
import { IBaseEvent, ICreatedPoll, EVENTS } from '@pollify/events';
import { ServerService } from 'src/server/server.service';
import { Client, MessageEmbed } from 'discord.js';
import { POLL_REACTION_EMOJIS } from 'src/common/constants';
import { PollService } from './poll.service';

@Controller()
export class PollConsumer {
  client: Client;

  constructor(
    private readonly serverService: ServerService,
    private readonly pollService: PollService,
  ) {}

  register(client: Client) {
    this.client = client;
  }

  @EventPattern('poll')
  pollEventHandler(@Payload() kafkaMessage: any) {
    const event: IBaseEvent = kafkaMessage.value;

    switch (event.name) {
      case EVENTS.POLLS.CREATED:
        this.handlePollCreatedEvent(event.value, +kafkaMessage.timestamp);
        break;

      case EVENTS.POLLS.DELETED:
        this.handlePollDeletedEvent(event.value);
        break;

      default:
        Logger.error(`Event with eventName: ${event.name} is unhandled.`);
        break;
    }
  }

  private async handlePollCreatedEvent(poll: ICreatedPoll, timestamp: number) {
    const messageEmbed = new MessageEmbed()
      .setColor('GREEN')
      .setTitle(poll.title)
      .setThumbnail(
        'https://pbs.twimg.com/profile_images/1085951295243108352/PJEAZi56.jpg',
      )
      .setDescription(poll.description)
      .setTimestamp(+timestamp)
      .setURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
      .addField(
        'Answers:',
        poll.answers
          .map((answer, i) => `${POLL_REACTION_EMOJIS[i]} - ${answer.text}`)
          .join('\r\n'),
      );

    const servers = await this.serverService.getAllServers();

    const serverWithMessageIds = await Promise.all(
      servers.map(
        async (server) =>
          await Promise.all(
            server.channelsSubscribedToPolls.map(async (channelId) => {
              const channel = this.client.channels.cache.get(channelId);

              if (channel?.isText()) {
                const message = await channel.send(messageEmbed);

                await Promise.all(
                  poll.answers.map(async (_, i) => {
                    return message.react(POLL_REACTION_EMOJIS[i]);
                  }),
                );

                return message.id;
              }
            }),
          ),
      ),
    );

    await this.pollService.create(poll, messageIds.flat());
  }

  private async handlePollDeletedEvent(poll: IDeletedPoll) {}
}
