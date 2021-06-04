import EVENTS from "../common/events";
import IBaseEvent from "../common/base-event.interface";
import { Poll } from "../generated/protos/polls/polls";

export interface ICreatedPoll extends Poll {
  creatorId: string;
}

export interface IPollCreatedEvent extends Omit<IBaseEvent, "value"> {
  value: ICreatedPoll;
}

export const NewPollCreatedEvent = (poll: ICreatedPoll): IPollCreatedEvent => {
  return {
    name: EVENTS.POLLS.POLL_CREATED,
    value: poll,
  };
};
