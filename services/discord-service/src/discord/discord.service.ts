import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Logger from '@pollify/logger';

import { Client } from 'discord.js';

@Injectable()
export class DiscordService {
  client: Client;
  ready: boolean;

  constructor(private configService: ConfigService) {}

  connect(): Client {
    this.client = new Client({
      partials: ['MESSAGE', 'REACTION'],
      presence: {
        status: 'online',
        activity: {
          name: 'polls being rigged',
          type: 'WATCHING',
        },
      },
    });

    this.client.on('ready', () => {
      Logger.info(`Discord connected with handle ${this.client.user.tag}`);
      this.ready = true;
    });

    this.client.login(this.configService.get<string>('DISCORD_CLIENT_SECRET'));

    return this.client;
  }

  getBotInviteLink(permissions = '26688'): string {
    return `https://discordapp.com/oauth2/authorize?client_id=${this.configService.get<string>(
      'DISCORD_CLIENT_ID',
    )}&scope=bot&permissions=${permissions}`;
  }
}
