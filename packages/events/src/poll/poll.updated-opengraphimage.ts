import EVENTS from "../common/events";
import IBaseEvent from "../common/base-event.interface";
import { Poll } from "../generated/protos/poll/poll";

export interface IOpengraphImageUpdatedPoll
  extends Pick<Poll, "opengraphImage" | "id"> {}

export interface IPollOpengraphImageUpdatedEvent
  extends Omit<IBaseEvent, "value"> {
  value: IOpengraphImageUpdatedPoll;
}

export const NewIPollOpengraphImageUpdatedEvent = (
  poll: IOpengraphImageUpdatedPoll
): IPollOpengraphImageUpdatedEvent => {
  return {
    name: EVENTS.POLL.OPENGRAPH_IMAGE_UPDATED,
    value: poll,
  };
};
