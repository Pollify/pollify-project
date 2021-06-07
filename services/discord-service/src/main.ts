import { NestFactory } from '@nestjs/core';
import Logger from '@pollify/logger';
import { AppModule } from './app.module';
import { DiscordService } from './discord/discord.service';
import { CommandsService } from './commands/commands.service';
import { ReactionsService } from './reactions/reactions.service';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { PollConsumer } from './poll/poll.consumer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const pollConsumer = app.get(PollConsumer);
  const configService = app.get(ConfigService);
  const discordService = app.get(DiscordService);
  const commandService = app.get(CommandsService);
  const reactionsService = app.get(ReactionsService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'discord-service',
        brokers: [configService.get('KAFKA_CLUSTER')],
      },
      consumer: {
        groupId: 'discord-service-consumer',
      },
    },
  });

  const client = await discordService.connect();
  pollConsumer.register(client);
  commandService.register(client);
  reactionsService.register(client);

  Logger.info(`Bot invite link: ${discordService.getBotInviteLink()}`);

  app.startAllMicroservices(async () => {
    await app.init();

    Logger.info(`Service successfully started`);
  });
}
bootstrap();
