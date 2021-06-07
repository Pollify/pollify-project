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
} from 'src/generated/protos/poll/poll';
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

  public async createPoll(@Payload() poll: CreatePollRequest): Promise<void> {
    var pollId = uuidv4();

    await this.kafkaPollService
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

    await this.kafkaPollService
      .send('poll', {
        key: request.id,
        value: NewPollDeletedEvent(request),
      })
      .toPromise();
  }

  public async getFeed(): Promise<PollsResponse> {
    const polls = await this.pollService.getAll();

    return {
      polls: polls,
    };
  }
}
