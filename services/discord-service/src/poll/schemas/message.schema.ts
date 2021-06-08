import { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  id: string;
  _id: string;
  channelId: string;
}

export const Message: Schema = new Schema({
  _id: String,
  channelId: String,
});
