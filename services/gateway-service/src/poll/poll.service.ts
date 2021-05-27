import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpcProxy } from '@nestjs/microservices';
import {
  PollServiceClient,
  POLL_PACKAGE_NAME,
  POLL_SERVICE_NAME,
} from 'src/generated/protos/polls/polls';
import Logger from '@pollify/logger';
import { CreatePollDto } from './dto/create-poll.dto';

@Injectable()
export class PollService implements OnModuleInit {
  private pollsService: PollServiceClient;

  constructor(
    @Inject(POLL_PACKAGE_NAME) private readonly pollsClient: ClientGrpcProxy,
  ) {}

  onModuleInit() {
    this.pollsService =
      this.pollsClient.getService<PollServiceClient>(POLL_SERVICE_NAME);
    Logger.info(this.pollsClient);
  }

  create(createPollDto: CreatePollDto) {
    Logger.info('create poll called');
    this.pollsService.createPoll({
      title: createPollDto.name,
      image: '',
      description: '',
      answers: [],
    });
  }
}
