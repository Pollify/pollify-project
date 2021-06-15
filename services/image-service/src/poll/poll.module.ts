import { HttpModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ImageModule } from 'src/image/image.module';
import { PollConsumer } from './poll.consumer';

@Module({
  controllers: [PollConsumer],
  imports: [HttpModule, ImageModule],
  providers: [
    {
      provide: 'KAFKA_SERVICE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
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
      },
      inject: [ConfigService],
    },
  ],
})
export class PollModule {}
