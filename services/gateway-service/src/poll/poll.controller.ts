import { Controller, Post, Body } from '@nestjs/common';
import { PollService } from './poll.service';
import { CreatePollDto } from './dto/create-poll.dto';

@Controller('poll')
export class PollController {
  constructor(private readonly pollService: PollService) {}

  @Post()
  create(@Body() createPollDto: CreatePollDto) {
    return this.pollService.create(createPollDto);
  }
}
