import { Controller } from '@nestjs/common';
import Logger from '@pollify/logger';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  IBaseEvent,
  ICreatedPoll,
  IDeletedPoll,
  EVENTS,
} from '@pollify/events';
import { PollService } from './poll.service';

@Controller()
export class PollConsumer {
  constructor(private readonly pollService: PollService) {}

  @EventPattern('poll')
  pollEventHandler(@Payload() kafkaMessage: any) {
    const event: IBaseEvent = kafkaMessage.value;

    switch (event.name) {
      case EVENTS.POLLS.CREATED:
        this.handlePollCreatedEvent(event.value);
        break;

      case EVENTS.POLLS.DELETED:
        this.handlePollDeletedEvent(event.value);
        break;

      default:
        Logger.error(`Event with eventName: ${event.name} is unhandled.`);
        break;
    }
  }

  private async handlePollCreatedEvent(event: ICreatedPoll) {
    await this.pollService.create(event);
  }

  private async handlePollDeletedEvent(event: IDeletedPoll) {
    await this.pollService.delete(event);
  }
}
