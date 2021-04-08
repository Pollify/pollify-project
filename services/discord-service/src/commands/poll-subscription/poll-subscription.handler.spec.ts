import { Test, TestingModule } from '@nestjs/testing';
import * as sinon from 'sinon';
import { MessageEmbed } from 'discord.js';

import { PollSubscriptionHandler } from './poll-subscription.handler';

describe('PollSubscriptionHandler', () => {
  let pollSubscriptionHandler: PollSubscriptionHandler;
  let testingModule: TestingModule;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [PollSubscriptionHandler],
    }).compile();

    pollSubscriptionHandler = testingModule.get<PollSubscriptionHandler>(
      PollSubscriptionHandler,
    );
  });

  it('should be defined', () => {
    expect(pollSubscriptionHandler).toBeDefined();
  });

  it('should respond on !poll-subscription', () => {
    expect(pollSubscriptionHandler.test('poll-subscription')).toBeTruthy();
    expect(pollSubscriptionHandler.test('PoLL-sUbscription')).toBeTruthy();
  });
});
