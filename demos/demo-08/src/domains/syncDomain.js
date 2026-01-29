import { createDomain } from "../framework/createDomain";

export const SyncDomain = createDomain({
  initialState: { status: "booting", isConnected: false, error: null },
  commands: {
    setStatus(state, next) {
      return {
        ...state,
        status: next.status ?? state.status,
        isConnected:
          typeof next.isConnected === "boolean"
            ? next.isConnected
            : state.isConnected,
        error: next.error ?? null,
      };
    },
  },
  selectors: {
    getStatus(state) {
      return state.status;
    },
    isSyncing(state) {
      return state.status === "syncing";
    },
    isConnecting(state) {
      return state.status === "connecting";
    },
    isOffline(state) {
      return state.status === "offline";
    },
    isConnected(state) {
      return state.isConnected;
    },
    getError(state) {
      return state.error;
    },
  },
});
