import { Controller } from '@nestjs/common';
import Logger from '@pollify/logger';
import { EventPattern, Payload } from '@nestjs/microservices';
import { IBaseEvent, ICreatedPoll, EVENTS } from '@pollify/events';

@Controller()
export class PollConsumer {
  constructor() {}

  @EventPattern('poll')
  pollEventHandler(@Payload() kafkaMessage: any) {
    const event: IBaseEvent = kafkaMessage.value;

    switch (event.name) {
      case EVENTS.POLLS.POLL_CREATED:
        this.handlePollCreatedEvent(event.value);
        break;

      default:
        Logger.error(`Event with eventName: ${event.name} is unhandled.`);
        break;
    }
  }

  private handlePollCreatedEvent(event: ICreatedPoll) {
    Logger.info('Handled event, yeet');
    Logger.info(event);
  }
}
