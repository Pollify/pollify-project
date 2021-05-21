import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import Logger from '@pollify/logger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';
import { POLL_PACKAGE_NAME } from './generated/protos/polls/polls';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  const url = `${configService.get('HOST')}:${configService.get('PORT')}`;

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: url,
      package: POLL_PACKAGE_NAME,
      protoPath: join(__dirname, '/generated/protos/polls/polls.proto'),
    },
  });

  app.startAllMicroservices(async () => {
    await app.init();

    Logger.info(`Running on: ${url}`);
  });
}
bootstrap();
