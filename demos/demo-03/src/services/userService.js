import { api } from "../effects/api";

export const UserService = {
  async fetchUser() {
    return api.fetchUser();
  },
};
