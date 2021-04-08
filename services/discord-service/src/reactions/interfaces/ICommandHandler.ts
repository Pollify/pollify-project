import { Message } from 'discord.js';

export interface IReactionHandler {
  execute: (message: Message) => Promise<void>;
  test: (content: string) => boolean;
}
