import {
  Controller,
  Inject,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { NewPollCreatedEvent, NewPollDeletedEvent } from '@pollify/events';
import { ClientKafka, Payload, RpcException } from '@nestjs/microservices';
import {
  CreatePollRequest,
  PollServiceController,
  PollServiceControllerMethods,
  PollsResponse,
  DeletePollRequest,
  GetPollRequest,
  Poll,
} from 'src/generated/protos/poll/poll';
import { v4 as uuidv4 } from 'uuid';
import { PollService } from './poll.service';

@Controller('poll')
@PollServiceControllerMethods()
export class PollController
  implements PollServiceController, OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaService: ClientKafka,
    private readonly pollService: PollService,
  ) {}

  async onModuleInit() {
    this.kafkaService.subscribeToResponseOf(`poll`);
    await this.kafkaService.connect();
  }

  onModuleDestroy() {
    this.kafkaService.close();
  }

  public async createPoll(@Payload() poll: CreatePollRequest): Promise<void> {
    var pollId = uuidv4();

    await this.kafkaService
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
  }

  public async deletePoll(
    @Payload() request: DeletePollRequest,
  ): Promise<void> {
    const foundPoll = await this.pollService.getOneById(request.id);

    if (!foundPoll)
      throw new RpcException({
        code: 5,
        message: 'Poll not found.',
      });

    if (foundPoll.creatorId !== request.deleterId)
      throw new RpcException({
        code: 7,
        message: 'No premission to delete this poll.',
      });

    await this.kafkaService
      .send('poll', {
        key: request.id,
        value: NewPollDeletedEvent(request),
      })
      .toPromise();
  }

  public async getPoll(@Payload() request: GetPollRequest): Promise<Poll> {
    const foundPoll = await this.pollService.getOneById(request.id);

    if (!foundPoll)
      throw new RpcException({
        code: 5,
        message: 'Poll not found.',
      });

    return foundPoll;
  }

  public async getFeed(): Promise<PollsResponse> {
    const polls = await this.pollService.getAll();

    return {
      polls: polls,
    };
  }
}
