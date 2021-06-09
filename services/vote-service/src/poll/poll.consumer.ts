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

    Logger.info(kafkaMessage);

    switch (event.name) {
      case EVENTS.POLL.CREATED:
        this.handlePollCreatedEvent(event.value);
        break;

      case EVENTS.POLL.DELETED:
        this.handlePollDeletedEvent(event.value);
        break;

      default:
        Logger.error(`Event with eventName: ${event.name} is unhandled.`);
        break;
    }
  }

  private async handlePollCreatedEvent(event: ICreatedPoll) {
    await this.voteService.create(event);
  }

  private async handlePollDeletedEvent(event: IDeletedPoll) {
    await this.voteService.delete(event);
  }
}
