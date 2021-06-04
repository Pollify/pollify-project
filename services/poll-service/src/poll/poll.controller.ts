import {
  Controller,
  Inject,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import Logger from '@pollify/logger';
import { NewPollCreatedEvent } from '@pollify/events';
import { ClientKafka, Payload } from '@nestjs/microservices';
import {
  CreatePollRequest,
  PollServiceController,
  PollServiceControllerMethods,
  PollsResponse,
  UuidRequest,
} from 'src/generated/protos/polls/polls';
import { v4 as uuidv4 } from 'uuid';
import { PollService } from './poll.service';

@Controller('poll')
@PollServiceControllerMethods()
export class PollController
  implements PollServiceController, OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject('POLL_SERVICE') private readonly kafkaPollService: ClientKafka,
    private readonly pollService: PollService,
  ) {}

  async onModuleInit() {
    this.kafkaPollService.subscribeToResponseOf(`poll`);
    await this.kafkaPollService.connect();
  }

  onModuleDestroy() {
    this.kafkaPollService.close();
  }

  public async createPoll(@Payload() poll: CreatePollRequest): Promise<string> {
    var pollId = uuidv4();

    Logger.info('Handled grpc call, yeet');

    this.kafkaPollService
      .send('poll', {
        key: pollId,
        value: NewPollCreatedEvent({
          id: pollId,
          creatorId: poll.creatorId,
          title: poll.title,
          image: poll.image,
          description: poll.description,
          answers: poll.answers.map((answer) => ({
            id: uuidv4(),
            text: answer,
          })),
        }),
      })
      .toPromise();

    return pollId;
  }

  public async deletePoll(@Payload() request: UuidRequest): Promise<void> {
    Logger.info('fdsafdsa');
    throw new Error('Method not implemented.');
  }
  public async getPollsByUserId(
    @Payload() request: UuidRequest,
  ): Promise<PollsResponse> {
    Logger.info('fdsafdsa');
    throw new Error('Method not implemented.');
  }

  public async getFeed(): Promise<PollsResponse> {
    const polls = await this.pollService.getAll();

    return {
      polls: polls,
    };
  }
}
