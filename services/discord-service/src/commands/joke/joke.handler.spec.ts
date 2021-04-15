import { Test, TestingModule } from '@nestjs/testing';

import { JokeHandler } from './joke.handler';

describe('JokeService', () => {
  let service: JokeHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JokeHandler],
    }).compile();

    service = module.get<JokeHandler>(JokeHandler);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should respond to the !ping command', () => {
    expect(service.test('joke')).toBe(true);
    expect(service.test('Joke')).toBe(true);
    expect(service.test('JOKE')).toBe(true);
    expect(service.test('JoKe')).toBe(true);
  });
});
