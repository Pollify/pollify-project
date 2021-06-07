import { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  id: string;
  _id: string;
}

export const Message: Schema = new Schema({
  _id: String,
});
