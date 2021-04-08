import { Test, TestingModule } from '@nestjs/testing';

import { PollHandler } from './poll.handler';

describe('PollHandler', () => {
  let pollHandler: PollHandler;
  let testingModule: TestingModule;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [PollHandler],
    }).compile();

    pollHandler = testingModule.get<PollHandler>(PollHandler);
  });

  it('should be defined', () => {
    expect(pollHandler).toBeDefined();
  });
});
