import { createDomain } from "../framework/createDomain";

export const EngineDomain = createDomain({
  initialState: {
    status: "booting",
    isConnected: false,
    clientId: "",
    error: null,
  },
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
    setClientId(state, clientId) {
      return { ...state, clientId };
    },
  },
  selectors: {
    getStatus(state) {
      return state.status;
    },
    isConnected(state) {
      return state.isConnected;
    },
    getClientId(state) {
      return state.clientId;
    },
    getError(state) {
      return state.error;
    },
  },
});
