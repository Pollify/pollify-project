import { Document, Schema } from 'mongoose';
import { Answer, IAnswer } from './answer.schema';
import { IServer, Server } from './server.schema';

export interface IPoll extends Document {
  _id: string;
  answers: IAnswer[];
  servers: IServer[];
}

export const Poll: Schema = new Schema({
  _id: String,
  answers: [Answer],
  servers: [Server],
});
