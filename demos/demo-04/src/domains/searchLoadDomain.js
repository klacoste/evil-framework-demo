import { createDomain } from "../framework/createDomain";

export const SearchLoadDomain = createDomain({
  initialState: {
    status: "idle",
    inFlightCount: 0,
    isStale: false,
  },
  commands: {
    setLoading(state) {
      return {
        status: "loading",
        inFlightCount: state.inFlightCount,
        isStale: state.isStale,
      };
    },
    incrementInFlight(state) {
      return {
        status: state.status,
        inFlightCount: state.inFlightCount + 1,
        isStale: state.isStale,
      };
    },
    decrementInFlight(state) {
      return {
        status: state.status,
        inFlightCount: Math.max(0, state.inFlightCount - 1),
        isStale: state.isStale,
      };
    },
    setIdle() {
      return {
        status: "idle",
        inFlightCount: 0,
        isStale: false,
      };
    },
    setStale(state, isStale) {
      return {
        status: state.status,
        inFlightCount: state.inFlightCount,
        isStale,
      };
    },
  },
  selectors: {
    isLoading(state) {
      return state.status === "loading";
    },
    getInFlightCount(state) {
      return state.inFlightCount;
    },
    isStale(state) {
      return state.isStale;
    },
  },
});
