import { Document, Schema } from 'mongoose';
import { IMessage, Message } from './message.schema';

export interface IServer extends Document {
  _id: string;
  messages: IMessage[];
}

export const Server: Schema = new Schema({
  _id: String,
  messages: [Message],
});
