import { Message, MessageReaction } from 'discord.js';

export interface IReactionHandler {
  test: (message: MessageReaction, clientId: string) => Promise<boolean>;
  execute: (message: MessageReaction, userId: string) => Promise<void>;
}
