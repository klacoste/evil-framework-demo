import { createDomain } from "../framework/createDomain";

const MAX_EVENTS = 25;

export const EventLogDomain = createDomain({
  initialState: { events: [] },
  commands: {
    append(state, event) {
      const nextEvents = [...state.events, event];
      const trimmed =
        nextEvents.length > MAX_EVENTS
          ? nextEvents.slice(nextEvents.length - MAX_EVENTS)
          : nextEvents;
      return { ...state, events: trimmed };
    },
    clear(state) {
      return { ...state, events: [] };
    },
  },
  selectors: {
    getEvents(state) {
      return state.events;
    },
  },
});
