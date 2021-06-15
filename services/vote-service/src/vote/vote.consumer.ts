import { Controller } from '@nestjs/common';
import Logger from '@pollify/logger';
import { EventPattern, Payload } from '@nestjs/microservices';
import { IBaseEvent, IVote, EVENTS } from '@pollify/events';
import { VoteService } from './vote.service';

@Controller()
export class VoteConsumer {
  constructor(private readonly voteService: VoteService) {}

  @EventPattern('vote')
  voteEventHandler(@Payload() kafkaMessage: any) {
    const event: IBaseEvent = kafkaMessage.value;

    switch (event.name) {
      case EVENTS.VOTE.VOTED:
        this.handleVotedEvent(event.value);
        this.logEvent(event);
        break;

      default:
        break;
    }
  }

  private async handleVotedEvent(event: IVote) {
    await this.voteService.setVote(event);
  }

  private logEvent(event: IBaseEvent) {
    Logger.info(`========== Handled event:`);
    Logger.info(event);
  }
}
