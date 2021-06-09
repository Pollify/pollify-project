import { Module } from '@nestjs/common';
import { VoteService } from './vote.service';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { VOTE_PACKAGE_NAME } from 'src/generated/protos/vote/vote';

@Module({
  providers: [
    {
      provide: VOTE_PACKAGE_NAME,
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            url: `${configService.get('VOTE_SVC')}:${configService.get(
              'GRPC_PORT',
            )}`,
            package: VOTE_PACKAGE_NAME,
            protoPath: join(__dirname, '/../generated/protos/vote/vote.proto'),
          },
        });
      },
      inject: [ConfigService],
    },
    VoteService,
  ],
  imports: [ConfigModule],
  exports: [VoteService],
})
export class VoteModule {}
