import { Module } from '@nestjs/common';
import { PollService } from './poll.service';
import { PollController } from './poll.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { POLL_PACKAGE_NAME } from 'src/generated/protos/polls/polls';

@Module({
  controllers: [PollController],
  providers: [PollService],
  imports: [
    ClientsModule.register([
      {
        name: POLL_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          url: '172.17.0.17:3000',
          package: POLL_PACKAGE_NAME,
          protoPath: join(__dirname, '/../generated/protos/polls/polls.proto'),
        },
      },
    ]),
  ],
})
export class PollModule {}
