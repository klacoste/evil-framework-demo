import { createDomain } from "../framework/createDomain";

export const AuthDomain = createDomain({
  initialState: {
    status: "anonymous",
    userId: null,
  },
  commands: {
    login(state, userId) {
      return {
        status: "authenticated",
        userId,
      };
    },
    logout() {
      return {
        status: "anonymous",
        userId: null,
      };
    },
  },
  selectors: {
    isAuthenticated(state) {
      return state.status === "authenticated";
    },
    getUserId(state) {
      return state.userId;
    },
  },
});
