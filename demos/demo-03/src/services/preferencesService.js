import { api } from "../effects/api";

export const PreferencesService = {
  async fetchPreferences(userId) {
    return api.fetchPreferences(userId);
  },
};
