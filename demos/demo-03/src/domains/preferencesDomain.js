import { createDomain } from "../framework/createDomain";

export const PreferencesDomain = createDomain({
  initialState: {
    preferences: null,
  },
  commands: {
    setPreferences(state, prefs) {
      return { preferences: prefs };
    },
    clearPreferences() {
      return { preferences: null };
    },
  },
  selectors: {
    getPreferences(state) {
      return state.preferences;
    },
    hasPreferences(state) {
      return state.preferences !== null;
    },
  },
});
