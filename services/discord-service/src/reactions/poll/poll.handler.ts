import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { MessageReaction } from 'discord.js';
import Logger from '@pollify/logger';
import { IReactionHandler } from '../interfaces/ICommandHandler';
import { PollService } from 'src/poll/poll.service';
import { POLL_REACTION_EMOJIS } from 'src/common/constants';
import { ClientKafka } from '@nestjs/microservices';
import { NewVotedEvent } from '@pollify/events';

@Injectable()
export class PollHandler
  implements IReactionHandler, OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly pollService: PollService,
    @Inject('KAFKA_SERVICE') private readonly kafkaService: ClientKafka,
  ) {}

  async onModuleInit() {
    this.kafkaService.subscribeToResponseOf(`vote`);
    await this.kafkaService.connect();
  }

  onModuleDestroy() {
    this.kafkaService.close();
  }

  async test(reaction: MessageReaction, clientId: string): Promise<boolean> {
    if (reaction.message.author.id != clientId) return false;

    if (
      reaction.message.embeds.length == 0 ||
      reaction.message.embeds[0].type != 'rich'
    )
      return false;

    const foundPoll = await this.pollService.findByMessageId(
      reaction.message.id,
    );

    if (!foundPoll) return false;

    return true;
  }

  async execute(reaction: MessageReaction, userId: string): Promise<void> {
    const reactionIndex = Object.keys(POLL_REACTION_EMOJIS).findIndex(
      (k) => POLL_REACTION_EMOJIS[k] === reaction.emoji.name,
    );

    const userReactions = reaction.message.reactions.cache.filter(
      (r) =>
        (reaction.users.cache.has(userId) &&
          r.emoji.name !== reaction.emoji.name) ||
        (reactionIndex == -1 && r.emoji.name == reaction.emoji.name),
    );

    try {
      for (const reaction of userReactions.values()) {
        await reaction.users.remove(userId);
      }
    } catch (error) {
      Logger.error('Failed to remove reactions.');
    }

    if (reactionIndex < 0) return;

    const foundPoll = await this.pollService.findByMessageId(
      reaction.message.id,
    );

    if (!foundPoll) return;

    const discordUserId = `#discord-${userId}`;

    await this.kafkaService
      .send('vote', {
        key: `${foundPoll.id}-${discordUserId}`,
        value: NewVotedEvent({
          votableId: foundPoll.id,
          voterId: discordUserId,
          answerId: foundPoll.answers[reactionIndex].id,
        }),
      })
      .toPromise();
  }
}
