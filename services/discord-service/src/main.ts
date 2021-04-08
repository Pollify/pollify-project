import { NestFactory } from '@nestjs/core';
import Logger from '@pollify/logger';

import { AppModule } from './app.module';
import { DiscordService } from './discord/discord.service';
import { CommandsService } from './commands/commands.service';
import { ReactionsService } from './reactions/reactions.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const discordService = app.get(DiscordService);
  const commandService = app.get(CommandsService);
  const reactionsService = app.get(ReactionsService);

  await app.listen(3000, async () => {
    Logger.info(`Running on port: 3000`);
    Logger.info(`Bot invite link: ${discordService.getBotInviteLink()}`);

    const client = await discordService.connect();
    commandService.register(client);
    reactionsService.register(client);
  });
}
bootstrap();

process.on('uncaughtException', (error) => {
  Logger.error(`UNHANDLED ERROR => ${error.message}`, error.stack);
});
