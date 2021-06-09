import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IVoteable } from './schemas/votable.schema';
import { ICreatedPoll, IDeletedPoll, IVote } from '@pollify/events';
import Logger from '@pollify/logger';

@Injectable()
export class VoteService {
  constructor(@InjectModel('votable') private votableModel: Model<IVoteable>) {}

  async getOneById(id: string): Promise<IVoteable> {
    return this.votableModel.findById(id);
  }

  async create(poll: ICreatedPoll): Promise<IVoteable> {
    const createdVotable = new this.votableModel({
      _id: poll.id,
      answers: poll.answers.map((answer) => ({
        _id: answer.id,
        votes: [],
      })),
    });

    return createdVotable.save();
  }

  async delete(poll: IDeletedPoll): Promise<void> {
    await this.votableModel.findByIdAndDelete(poll.id);
  }

  async setVote(vote: IVote): Promise<void> {
    const votable = await this.votableModel.findById(vote.votableId);

    if (votable) {
      votable.answers.forEach((answer) => {
        answer.votes = answer.votes.filter((v) => v !== vote.voterId);
      });

      votable.answers
        .find((a) => a.id == vote.answerId)
        ?.votes.push(vote.voterId);

      await votable.save();
    }
  }
}
