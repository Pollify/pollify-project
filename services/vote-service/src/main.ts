import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import Logger from '@pollify/logger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';
import { VOTE_PACKAGE_NAME } from './generated/protos/vote/vote';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: `${configService.get('HOST')}:${configService.get('GRPC_PORT')}`,
      package: VOTE_PACKAGE_NAME,
      protoPath: join(__dirname, './generated/protos/vote/vote.proto'),
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'vote-service',
        brokers: [configService.get('KAFKA_CLUSTER')],
      },
      consumer: {
        groupId: 'vote-service-consumer',
      },
    },
  });

  app.startAllMicroservices(async () => {
    await app.init();

    Logger.info(`Service successfully started`);
  });
}
bootstrap();
