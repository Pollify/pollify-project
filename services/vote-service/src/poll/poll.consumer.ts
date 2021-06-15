import { Controller } from '@nestjs/common';
import Logger from '@pollify/logger';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  IBaseEvent,
  ICreatedPoll,
  IDeletedPoll,
  EVENTS,
} from '@pollify/events';
import { VoteService } from 'src/vote/vote.service';

@Controller()
export class PollConsumer {
  constructor(private readonly voteService: VoteService) {}

  @EventPattern('poll')
  pollEventHandler(@Payload() kafkaMessage: any) {
    const event: IBaseEvent = kafkaMessage.value;

    switch (event.name) {
      case EVENTS.POLL.CREATED:
        this.handlePollCreatedEvent(event.value);
        this.logEvent(event);
        break;

      case EVENTS.POLL.DELETED:
        this.handlePollDeletedEvent(event.value);
        this.logEvent(event);
        break;

      default:
        break;
    }
  }

  private async handlePollCreatedEvent(event: ICreatedPoll) {
    await this.voteService.create(event);
  }

  private async handlePollDeletedEvent(event: IDeletedPoll) {
    await this.voteService.delete(event);
  }

  private logEvent(event: IBaseEvent) {
    Logger.info(`========== Handled event:`);
    Logger.info(event);
  }
}
