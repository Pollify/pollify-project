import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ICreatedPoll } from '@pollify/events';
import { Model } from 'mongoose';

import { IPoll } from './schemas/poll.schema';

@Injectable()
export class PollService {
  constructor(@InjectModel('poll') private pollModel: Model<IPoll>) {}

  async create(poll: ICreatedPoll, messageIds: string[]): Promise<IPoll> {
    const createdPoll = new this.pollModel({
      _id: poll.id,
      answers: poll.answers.map((answer) => ({
        _id: answer.id,
      })),
      messages: messageIds.map((id) => ({
        _id: id,
      })),
    });

    return createdPoll.save();
  }

  async findByMessageId(id: string): Promise<IPoll> {
    return this.pollModel.findOne({
      messages: { $elemMatch: { _id: id } },
    });
  }
}
