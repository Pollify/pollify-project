import { Document, Schema } from 'mongoose';
import { Answer, IAnswer } from './answer.schema';

export interface IPoll extends Document {
  id: string;
  _id: string;
  title: string;
  description: string;
  creatorId: string;
  opengraphImage?: string;
  answers: IAnswer[];
}

export const Poll: Schema = new Schema({
  _id: String,
  title: String,
  description: String,
  creatorId: String,
  opengraphImage: String,
  answers: [Answer],
});
