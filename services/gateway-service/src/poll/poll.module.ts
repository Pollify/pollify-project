import { Module } from '@nestjs/common';
import { PollService } from './poll.service';
import { PollController } from './poll.controller';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { POLL_PACKAGE_NAME } from 'src/generated/protos/polls/polls';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [PollController],
  providers: [
    {
      provide: POLL_PACKAGE_NAME,
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            url: `${configService.get('POLL_SVC')}:${configService.get(
              'GRPC_PORT',
            )}`,
            package: POLL_PACKAGE_NAME,
            protoPath: join(
              __dirname,
              '/../generated/protos/polls/polls.proto',
            ),
          },
        });
      },
      inject: [ConfigService],
    },
    PollService,
  ],
  imports: [ConfigModule],
})
export class PollModule {}
