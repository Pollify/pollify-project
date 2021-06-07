import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import Logger from '@pollify/logger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';
import { POLL_PACKAGE_NAME } from './generated/protos/poll/poll';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: `${configService.get('HOST')}:${configService.get('GRPC_PORT')}`,
      package: POLL_PACKAGE_NAME,
      protoPath: join(__dirname, '/generated/protos/poll/poll.proto'),
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'poll-service',
        brokers: [configService.get('KAFKA_CLUSTER')],
      },
      consumer: {
        groupId: 'poll-service-consumer',
      },
    },
  });

  app.startAllMicroservices(async () => {
    await app.init();

    Logger.info(`Service successfully started`);
  });
}
bootstrap();
