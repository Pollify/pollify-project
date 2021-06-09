import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpcProxy } from '@nestjs/microservices';
import {
  VoteResponse,
  VoteServiceClient,
  VOTE_PACKAGE_NAME,
  VOTE_SERVICE_NAME,
} from 'src/generated/protos/vote/vote';

@Injectable()
export class VoteService implements OnModuleInit {
  private voteGRPCService: VoteServiceClient;

  constructor(
    @Inject(VOTE_PACKAGE_NAME) private readonly voteClient: ClientGrpcProxy,
  ) {}

  onModuleInit() {
    this.voteGRPCService =
      this.voteClient.getService<VoteServiceClient>(VOTE_SERVICE_NAME);
  }

  async vote(votableId: string, voterId: string, answerId: string) {
    await this.voteGRPCService
      .vote({ votableId: votableId, voterId: voterId, answerId: answerId })
      .toPromise();
  }

  async getVotableVotesCount(
    id: string,
    userId: string,
  ): Promise<VoteResponse> {
    return this.voteGRPCService
      .getVotableVotesCount({ id: id, voterId: userId })
      .toPromise();
  }
}
