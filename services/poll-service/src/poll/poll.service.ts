import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IPoll } from './schemas/poll.schema';
import { ICreatedPoll, IDeletedPoll } from '@pollify/events';

@Injectable()
export class PollService {
  constructor(@InjectModel('poll') private pollModel: Model<IPoll>) {}

  async create(poll: ICreatedPoll): Promise<IPoll> {
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

    return createdPoll.save();
  }

  async delete(poll: IDeletedPoll): Promise<void> {
    await this.pollModel.findByIdAndDelete(poll.id);
  }

  async getAll(): Promise<IPoll[]> {
    return this.pollModel.find();
  }

  async getOneById(id: string): Promise<IPoll> {
    return this.pollModel.findById(id);
  }
}
