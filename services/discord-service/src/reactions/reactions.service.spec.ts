import { Test, TestingModule } from '@nestjs/testing';
import { ReactionsService } from './reactions.service';
import { DiscordModule } from '../discord/discord.module';

describe('ReactionsService', () => {
  let service: ReactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DiscordModule],
    }).compile();

    service = module.get<ReactionsService>(ReactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
