import { createDomain } from "../framework/createDomain";

export const ConnectivityDomain = createDomain({
  initialState: { isOnline: true },
  commands: {
    setOnline(state) {
      return { ...state, isOnline: true };
    },
    setOffline(state) {
      return { ...state, isOnline: false };
    },
  },
  selectors: {
    isOnline(state) {
      return state.isOnline;
    },
  },
});
