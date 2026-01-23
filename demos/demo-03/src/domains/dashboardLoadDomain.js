import { createDomain } from "../framework/createDomain";

export const DashboardLoadDomain = createDomain({
  initialState: {
    status: "idle",
    error: null,
  },
  commands: {
    setIdle() {
      return { status: "idle", error: null };
    },
    setLoading() {
      return { status: "loading", error: null };
    },
    setError(state, error) {
      return { status: "error", error };
    },
  },
  selectors: {
    getStatus(state) {
      return state.status;
    },
    isLoading(state) {
      return state.status === "loading";
    },
    hasError(state) {
      return state.status === "error";
    },
    getError(state) {
      return state.error;
    },
  },
});
