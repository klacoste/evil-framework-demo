import { createDomain } from "../framework/createDomain";

export const UserDomain = createDomain({
  initialState: {
    user: null,
    status: "idle",
    error: null,
  },
  commands: {
    setLoading(state) {
      return {
        user: null,
        status: "loading",
        error: null,
      };
    },
    setUser(state, user) {
      return {
        user,
        status: "success",
        error: null,
      };
    },
    setError(state, error) {
      return {
        user: null,
        status: "error",
        error,
      };
    },
  },
  selectors: {
    getUser(state) {
      return state.user;
    },
    getStatus(state) {
      return state.status;
    },
    getError(state) {
      return state.error;
    },
    isLoading(state) {
      return state.status === "loading";
    },
    hasError(state) {
      return state.status === "error";
    },
  },
});
