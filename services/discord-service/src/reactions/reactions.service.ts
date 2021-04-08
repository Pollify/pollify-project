import { Injectable } from '@nestjs/common';
import { Client, MessageReaction, PartialUser, User } from 'discord.js';
import Logger from '@pollify/logger';
import { IReactionHandler } from './interfaces/ICommandHandler';

@Injectable()
export class ReactionsService {
  reactionHandlers: IReactionHandler[] = [];

  constructor() {
    this.reactionHandlers = [];
  }

  register(client: Client) {
    client.on('messageReactionAdd', async (reaction, user) => {
      if (reaction.partial) {
        try {
          await reaction.fetch();
        } catch (error) {
          Logger.error(error);
          return;
        }
      }

      if (user.partial) {
        try {
          await user.fetch();
        } catch (error) {
          Logger.error(error);
          return;
        }
      }

      try {
        await this.reactionHandler(reaction, user);
      } catch (error) {
        Logger.error(error);
      }
    });
  }

  async reactionHandler(reaction: MessageReaction, user: User | PartialUser) {
    Logger.info(reaction);
    Logger.info(user);
  }

  private escapePrefixForRegexp(serverPrefix: string): string {
    const char = serverPrefix[0];
    if ('./+\\*!?)([]{}^$'.split('').includes(char)) return `\\${serverPrefix}`;
    return serverPrefix;
  }
}
