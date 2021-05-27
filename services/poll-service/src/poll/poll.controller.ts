import { Controller } from '@nestjs/common';
import Logger from '@pollify/logger';
import { Payload } from '@nestjs/microservices';
import {
  CreatePollRequest,
  PollServiceController,
  PollServiceControllerMethods,
  PollsResponse,
  UuidRequest,
} from 'src/generated/protos/polls/polls';

@Controller('poll')
@PollServiceControllerMethods()
export class PollController implements PollServiceController {
  public async createPoll(
    @Payload() request: CreatePollRequest,
  ): Promise<void> {
    Logger.info('fdsafdsa');

    throw new Error('Method not implemented.');
  }
  public async deletePoll(@Payload() request: UuidRequest): Promise<void> {
    Logger.info('fdsafdsa');
    throw new Error('Method not implemented.');
  }
  public async getPollsByUserId(
    @Payload() request: UuidRequest,
  ): Promise<PollsResponse> {
    Logger.info('fdsafdsa');
    throw new Error('Method not implemented.');
  }
}
