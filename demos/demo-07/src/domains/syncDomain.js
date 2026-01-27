import { createDomain } from "../framework/createDomain";

export const SyncDomain = createDomain({
  initialState: { status: "idle", error: null },
  commands: {
    setIdle(state) {
      return { ...state, status: "idle", error: null };
    },
    setSyncing(state) {
      return { ...state, status: "syncing", error: null };
    },
    setConflict(state) {
      return { ...state, status: "conflict", error: null };
    },
    setError(state, message) {
      return { ...state, status: "error", error: message };
    },
  },
  selectors: {
    getStatus(state) {
      return state.status;
    },
    isSyncing(state) {
      return state.status === "syncing";
    },
    hasError(state) {
      return state.status === "error";
    },
    getError(state) {
      return state.error;
    },
  },
});
