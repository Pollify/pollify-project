import { Schema, Document } from 'mongoose';

export interface IServer extends Document {
  _id: string;
  channelsSubscribedToPolls: string[];
}

export const Server: Schema = new Schema({
  _id: String,
  channelsSubscribedToPolls: [String],
});
