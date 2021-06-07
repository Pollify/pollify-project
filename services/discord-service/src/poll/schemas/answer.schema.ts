import { Schema, Document } from 'mongoose';

export interface IAnswer extends Document {
  id: string;
  _id: string;
}

export const Answer: Schema = new Schema({
  _id: String,
});
