import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Delete,
  Param,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Put,
} from '@nestjs/common';
import { PollService } from './poll.service';
import { CreatePollDto } from './dto/create-poll.dto';
import { PollifyAuthGuard } from 'src/auth/auth-guard';
import { CurrentUser } from 'src/auth/user-decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PollsResponse } from './../generated/protos/poll/poll';
import { VoteService } from 'src/vote/vote.service';

@Controller('poll')
@UseGuards(PollifyAuthGuard)
@ApiBearerAuth()
export class PollController {
  constructor(
    private readonly pollService: PollService,
    private readonly voteSerivce: VoteService,
  ) {}

  @Get(':id')
  async get(@Param('id') id: string, @CurrentUser() userId: string) {
    const foundPoll = await this.pollService.get(id);
    const foundVotable = await this.voteSerivce.getVotableVotesCount(
      id,
      userId,
    );

    if (!foundPoll || !foundVotable)
      throw new NotFoundException('Vote could not be found');

    return {
      ...foundPoll,
      answers: foundPoll.answers.map((answer) => {
        const votableVote = foundVotable.votes.find((v) => v.id == answer.id);

        return {
          ...answer,
          votes: votableVote?.count | 0 || 0,
          userVote: votableVote?.userVote || false,
        };
      }),
    };
  }

  @Post()
  async create(
    @CurrentUser() userId: string,
    @Body() createPollDto: CreatePollDto,
  ) {
    return this.pollService.create(createPollDto, userId);
  }

  @Get()
  async getFeed(): Promise<PollsResponse> {
    return this.pollService.getFeed();
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @CurrentUser() userId: string) {
    try {
      await this.pollService.delete(id, userId);
    } catch (error) {
      switch (error.code) {
        case 5:
          throw new NotFoundException(error.message);
        case 7:
          throw new ForbiddenException(error.message);
        default:
          throw new BadRequestException();
      }
    }
  }

  @Put(':pollId/:answerId')
  async vote(
    @Param('pollId') pollId: string,
    @Param('answerId') answerId: string,
    @CurrentUser() userId: string,
  ) {
    try {
      this.voteSerivce.vote(pollId, userId, answerId);
    } catch (error) {
      switch (error.code) {
        case 5:
          throw new NotFoundException(error.message);
        case 7:
          throw new ForbiddenException(error.message);
        default:
          throw new BadRequestException();
      }
    }
  }
}
