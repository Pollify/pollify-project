import { Document, Schema } from 'mongoose';
import { Answer, IAnswer } from './answer.schema';

export interface IVoteable extends Document {
  id: string;
  _id: string;
  answers: IAnswer[];
}

export const Votable: Schema = new Schema({
  _id: String,
  answers: [Answer],
});
