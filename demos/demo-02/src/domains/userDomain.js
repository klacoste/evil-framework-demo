import { createDomain } from "../framework/createDomain";

export const UserDomain = createDomain({
  initialState: {
    user: null,
  },
  commands: {
    setUser(state, user) {
      return {
        user,
      };
    },
    clearUser() {
      return {
        user: null,
      };
    },
  },
  selectors: {
    getUser(state) {
      return state.user;
    },
    hasUser(state) {
      return state.user !== null;
    },
  },
});
