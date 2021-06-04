import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { PollService } from './poll.service';
import { CreatePollDto } from './dto/create-poll.dto';
import { PollifyAuthGuard } from 'src/auth/auth-guard';
import { CurrentUser } from 'src/auth/user-decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PollsResponse } from 'src/generated/protos/polls/polls';

@Controller('poll')
@UseGuards(PollifyAuthGuard)
@ApiBearerAuth()
export class PollController {
  constructor(private readonly pollService: PollService) {}

  @Post()
  async create(
    @CurrentUser() userId: string,
    @Body() createPollDto: CreatePollDto,
  ) {
    this.pollService.create(createPollDto, userId);
  }

  @Get()
  async getFeed(): Promise<PollsResponse> {
    return this.pollService.getFeed();
  }
}
