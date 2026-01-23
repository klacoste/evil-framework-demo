import { createDomain } from "../framework/createDomain";

export const SessionLoadDomain = createDomain({
  initialState: {
    status: "idle",
  },
  commands: {
    setLoading() {
      return { status: "loading" };
    },
    setIdle() {
      return { status: "idle" };
    },
  },
  selectors: {
    isLoading(state) {
      return state.status === "loading";
    },
  },
});
