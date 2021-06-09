import EVENTS from "../common/events";
import IBaseEvent from "../common/base-event.interface";
import { Poll } from "../generated/protos/poll/poll";

export interface IDeletedPoll extends Pick<Poll, "id"> {
  deleterId: string;
}

export interface IPollDeletedEvent extends Omit<IBaseEvent, "value"> {
  value: IDeletedPoll;
}

export const NewPollDeletedEvent = (
  deletedPoll: IDeletedPoll
): IPollDeletedEvent => {
  return {
    name: EVENTS.POLL.DELETED,
    value: deletedPoll,
  };
};
