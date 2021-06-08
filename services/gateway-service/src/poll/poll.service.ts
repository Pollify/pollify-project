import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpcProxy } from '@nestjs/microservices';
import {
  PollServiceClient,
  PollsResponse,
  POLL_PACKAGE_NAME,
  POLL_SERVICE_NAME,
} from './../generated/protos/poll/poll';
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
    await this.pollsService
      .createPoll({
        ...createPollDto,
        creatorId: creatorId,
      })
      .toPromise();
  }

  async getFeed(): Promise<PollsResponse> {
    return this.pollsService.getFeed({}).toPromise();
  }

  async delete(id: string, deleterId: string) {
    await this.pollsService
      .deletePoll({ id: id, deleterId: deleterId })
      .toPromise();
  }
}
