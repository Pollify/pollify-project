import {
  Controller,
  HttpService,
  Inject,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import Logger from '@pollify/logger';
import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';
import {
  IBaseEvent,
  ICreatedPoll,
  EVENTS,
  IDeletedPoll,
  NewIPollOpengraphImageUpdatedEvent,
} from '@pollify/events';
import { ImageService } from 'src/image/image.service';
import { POLL_BUCKET_NAME } from 'src/common/constants';

@Controller()
export class PollConsumer implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaService: ClientKafka,
    private readonly httpService: HttpService,
    private readonly imageService: ImageService,
  ) {}

  async onModuleInit() {
    this.kafkaService.subscribeToResponseOf('poll');
    await this.kafkaService.connect();
  }

  onModuleDestroy() {
    this.kafkaService.close();
  }

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

  private async handlePollCreatedEvent(poll: ICreatedPoll) {
    const opengraphImage = await this.httpService
      .post(
        'https://europe-west1-opengraph-image-generator.cloudfunctions.net/opengraph',
        { brand: 'Pollify - Thrustworthy polls', title: poll.description },
        { responseType: 'arraybuffer' },
      )
      .toPromise()
      .then((response) => Buffer.from(response.data, 'binary'));

    const imageName = `${poll.id}.png`;

    await this.imageService.uploadImage(
      POLL_BUCKET_NAME,
      imageName,
      opengraphImage,
    );

    await this.kafkaService
      .send('poll', {
        key: poll.id,
        value: NewIPollOpengraphImageUpdatedEvent({
          id: poll.id,
          opengraphImage: `${POLL_BUCKET_NAME}/public/${imageName}`,
        }),
      })
      .toPromise();
  }

  private async handlePollDeletedEvent(poll: IDeletedPoll) {
    await this.imageService.removeImage(POLL_BUCKET_NAME, `${poll.id}.png`);
  }

  private logEvent(event: IBaseEvent) {
    Logger.info(`========== Handled event:`);
    Logger.info(event);
  }
}
