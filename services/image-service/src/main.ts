import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import Logger from '@pollify/logger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'image-service',
        brokers: [configService.get('KAFKA_CLUSTER')],
      },
      consumer: {
        groupId: 'image-service-consumer',
      },
    },
  });

  app.startAllMicroservices(async () => {
    await app.init();

    Logger.info(`Service successfully started`);
  });
}
bootstrap();
