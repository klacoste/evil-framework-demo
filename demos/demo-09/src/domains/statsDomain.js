import { createDomain } from "../framework/createDomain";

export const StatsDomain = createDomain({
  initialState: {
    localTransactions: 0,
    outboundQueued: 0,
    outboundSent: 0,
    inboundReceived: 0,
    remoteApplied: 0,
    lastServerSeenAt: null,
  },
  commands: {
    setStats(state, next) {
      return { ...state, ...next };
    },
  },
  selectors: {
    getStats(state) {
      return state;
    },
  },
});
