import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpcProxy } from '@nestjs/microservices';
import {
  PollServiceClient,
  PollsResponse,
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
  }

  async create(createPollDto: CreatePollDto, creatorId: string) {
    const result = await this.pollsService
      .createPoll({
        ...createPollDto,
        creatorId: creatorId,
      })
      .toPromise();

    Logger.info(result);
  }

  async getFeed(): Promise<PollsResponse> {
    return this.pollsService.getFeed({}).toPromise();
  }
}
