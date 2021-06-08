import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ICreatedPoll } from '@pollify/events';
import { Model } from 'mongoose';

import { IPoll } from './schemas/poll.schema';

@Injectable()
export class PollService {
  constructor(@InjectModel('poll') private pollModel: Model<IPoll>) {}

  async create(poll: ICreatedPoll, serversAndMessageIds: any): Promise<IPoll> {
    const createdPoll = new this.pollModel({
      _id: poll.id,
      answers: poll.answers.map((answer) => ({
        _id: answer.id,
      })),
      servers: serversAndMessageIds.map((s) => ({
        _id: s.serverId,
        messages: s.messages.map((m) => ({
          _id: m.messageId,
          channelId: m.channelId,
        })),
      })),
    });

    return createdPoll.save();
  }

  async findByMessageId(id: string): Promise<IPoll> {
    return this.pollModel.findOne({
      'servers.messages._id': id,
    });
  }

  async findById(id: string): Promise<IPoll> {
    return this.pollModel.findById(id);
  }
}
