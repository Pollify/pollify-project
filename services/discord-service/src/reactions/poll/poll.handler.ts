import { Injectable } from '@nestjs/common';
import { MessageReaction } from 'discord.js';
import Logger from '@pollify/logger';
import { IReactionHandler } from '../interfaces/ICommandHandler';
import { PollService } from 'src/poll/poll.service';
import { POLL_REACTION_EMOJIS } from 'src/common/constants';

@Injectable()
export class PollHandler implements IReactionHandler {
  constructor(private readonly pollService: PollService) {}

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
      console.error('Failed to remove reactions.');
    }

    if (reactionIndex < 0) return;

    const foundPoll = await this.pollService.findByMessageId(
      reaction.message.id,
    );

    if (!foundPoll) return;

    Logger.info(foundPoll.answers[reactionIndex].id);
  }
}
