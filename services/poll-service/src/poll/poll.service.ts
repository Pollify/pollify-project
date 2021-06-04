import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IPoll } from './schemas/poll.schema';
import { ICreatedPoll } from '@pollify/events';

@Injectable()
export class PollService {
  constructor(@InjectModel('poll') private pollModel: Model<IPoll>) {}

  async create(poll: ICreatedPoll) {
    const createdPoll = new this.pollModel({
      _id: poll.id,
      creatorId: poll.creatorId,
      title: poll.title,
      description: poll.description,
      answers: poll.answers.map((answer) => ({
        _id: answer.id,
        text: answer.text,
      })),
    });

    await createdPoll.save();
    console.log(createdPoll);
  }

  async getAll(): Promise<IPoll[]> {
    return this.pollModel.find().exec();
  }
}
