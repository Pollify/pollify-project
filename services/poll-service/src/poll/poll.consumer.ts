import { Controller } from '@nestjs/common';
import Logger from '@pollify/logger';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  IBaseEvent,
  ICreatedPoll,
  IDeletedPoll,
  IOpengraphImageUpdatedPoll,
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
      case EVENTS.POLL.CREATED:
        this.handlePollCreatedEvent(event.value);
        this.logEvent(event);
        break;

      case EVENTS.POLL.DELETED:
        this.handlePollDeletedEvent(event.value);
        this.logEvent(event);
        break;

      case EVENTS.POLL.OPENGRAPH_IMAGE_UPDATED:
        this.handlePollOpengraphImageUpdatedEvent(event.value);
        this.logEvent(event);
        break;

      default:
        break;
    }
  }

  private async handlePollCreatedEvent(poll: ICreatedPoll) {
    await this.pollService.create(poll);
  }

  private async handlePollDeletedEvent(poll: IDeletedPoll) {
    await this.pollService.delete(poll);
  }

  private async handlePollOpengraphImageUpdatedEvent(
    poll: IOpengraphImageUpdatedPoll,
  ) {
    await this.pollService.update(poll.id, {
      opengraphImage: poll.opengraphImage,
    });
  }

  private logEvent(event: IBaseEvent) {
    Logger.info(`========== Handled event:`);
    Logger.info(event);
  }
}
