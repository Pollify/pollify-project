import { Schema, Document } from 'mongoose';

export interface IAnswer extends Document {
  id: string;
  _id: string;
  text: string;
}

export const Answer: Schema = new Schema({
  _id: String,
  text: String,
});
