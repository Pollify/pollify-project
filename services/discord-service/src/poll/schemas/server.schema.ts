import { Document, Schema } from 'mongoose';

export interface IServer extends Document {
  id: string;
  _id: string;
  serverId: string;
}

export const Server: IServer = new Schema({
  _id: String,
  serverId: String,
});
