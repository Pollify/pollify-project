import EVENTS from "../common/events";
import IBaseEvent from "../common/base-event.interface";
import { VoteRequest } from "../generated/protos/vote/vote";

export interface IVote extends VoteRequest {}

export interface IVotedEvent extends Omit<IBaseEvent, "value"> {
  value: IVote;
}

export const NewVotedEvent = (vote: IVote): IVotedEvent => {
  return {
    name: EVENTS.VOTE.VOTED,
    value: vote,
  };
};
