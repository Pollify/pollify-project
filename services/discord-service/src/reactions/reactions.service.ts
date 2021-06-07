import { Injectable } from '@nestjs/common';
import { Client, MessageReaction } from 'discord.js';
import Logger from '@pollify/logger';
import { IReactionHandler } from './interfaces/ICommandHandler';
import { PollHandler } from './poll/poll.handler';

@Injectable()
export class ReactionsService {
  reactionHandlers: IReactionHandler[] = [];

  constructor(pollHandler: PollHandler) {
    this.reactionHandlers = [pollHandler];
  }

  register(client: Client) {
    client.on('messageReactionAdd', async (reaction, user) => {
      if (user.bot == true) return;
      if (!reaction.message.guild) return;

      if (reaction.partial) {
        try {
          await reaction.fetch();
        } catch (error) {
          Logger.error(error);
          return;
        }
      }

      if (reaction.message.partial) {
        try {
          await reaction.message.fetch();
        } catch (error) {
          Logger.error(error);
          return;
        }
      }

      await this.handleReaction(reaction, client.user.id, user.id);
    });
  }

  async handleReaction(
    reaction: MessageReaction,
    clientId: string,
    userId: string,
  ) {
    for (const handler of this.reactionHandlers) {
      if (await handler.test(reaction, clientId)) {
        try {
          await handler.execute(reaction, userId);
        } catch (error) {
          Logger.error(error.message);
        }
      }
    }
  }
}
