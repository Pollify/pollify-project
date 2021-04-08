import { Test, TestingModule } from '@nestjs/testing';
import * as sinon from 'sinon';
import { MessageEmbed } from 'discord.js';

import { HelpHandler } from './help.handler';

describe('HelpHandler', () => {
  let helpHandler: HelpHandler;
  let testingModule: TestingModule;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [HelpHandler],
    }).compile();

    helpHandler = testingModule.get<HelpHandler>(HelpHandler);
  });

  it('should be defined', () => {
    expect(helpHandler).toBeDefined();
  });

  it('should respond on !help', () => {
    expect(helpHandler.test('help')).toBeTruthy();
    expect(helpHandler.test('HELP')).toBeTruthy();
  });

  it('should respond an embed', async () => {
    const message = {
      guild: {
        id: 'test',
      },
      channel: {
        send: sinon.stub(),
      },
    } as any;

    await helpHandler.execute(message);
    expect(message.channel.send.getCall(0).args[0]).toBeInstanceOf(
      MessageEmbed,
    );
  });
});
