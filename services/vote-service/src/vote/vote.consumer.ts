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
        break;

      default:
        Logger.error(`Event with eventName: ${event.name} is unhandled.`);
        break;
    }
  }

  private async handleVotedEvent(event: IVote) {
    await this.voteService.setVote(event);
  }
}
