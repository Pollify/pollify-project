import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
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
    @Inject(POLL_PACKAGE_NAME) private readonly pollsClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.pollsService =
      this.pollsClient.getService<PollServiceClient>(POLL_SERVICE_NAME);
  }

  create(createPollDto: CreatePollDto) {
    Logger.info(createPollDto);
    this.pollsService.createPoll({
      title: createPollDto.name,
      image: '',
      description: '',
      answers: [],
    });
  }
}
