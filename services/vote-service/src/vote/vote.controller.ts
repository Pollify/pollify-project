import {
  Controller,
  Inject,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ClientKafka, Payload, RpcException } from '@nestjs/microservices';
import { VoteService } from './vote.service';
import {
  VotableRequest,
  VoteRequest,
  VoteResponse,
  VoteServiceController,
  VoteServiceControllerMethods,
} from 'src/generated/protos/vote/vote';
import { NewVotedEvent } from '@pollify/events';

@Controller('vote')
@VoteServiceControllerMethods()
export class VoteController
  implements VoteServiceController, OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaService: ClientKafka,
    private readonly voteService: VoteService,
  ) {}

  async onModuleInit() {
    this.kafkaService.subscribeToResponseOf(`vote`);
    await this.kafkaService.connect();
  }

  onModuleDestroy() {
    this.kafkaService.close();
  }

  public async vote(@Payload() vote: VoteRequest): Promise<void> {
    const foundVotable = await this.voteService.getOneById(vote.votableId);

    if (!foundVotable)
      throw new RpcException({
        code: 5,
        message: 'Votable not found.',
      });

    await this.kafkaService
      .send('vote', {
        key: `${vote.votableId}-${vote.voterId}`,
        value: NewVotedEvent(vote),
      })
      .toPromise();
  }

  public async getVotableVotesCount(
    @Payload() request: VotableRequest,
  ): Promise<VoteResponse> {
    const foundVotable = await this.voteService.getOneById(request.id);

    if (!foundVotable)
      throw new RpcException({
        code: 5,
        message: 'Votable not found.',
      });

    return {
      votableId: foundVotable.id,
      votes: foundVotable.answers.map((answer) => ({
        id: answer.id,
        count: answer.votes.length,
        userVote: request.voterId && answer.votes.includes(request.voterId),
      })),
    };
  }
}
