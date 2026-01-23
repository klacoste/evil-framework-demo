import { createDomain } from "../framework/createDomain";

export const UserProfileDomain = createDomain({
  initialState: {
    profile: null,
  },
  commands: {
    setProfile(state, profile) {
      return { profile };
    },
    clearProfile() {
      return { profile: null };
    },
  },
  selectors: {
    getProfile(state) {
      return state.profile;
    },
    hasProfile(state) {
      return state.profile !== null;
    },
  },
});
