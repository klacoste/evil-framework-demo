import { UserDomain } from "../domains/userDomain";
import { api } from "../effects/api";

export const UserService = {
  async loadUser() {
    UserDomain.commands.setLoading();

    try {
      const user = await api.fetchUser();
      UserDomain.commands.setUser(user);
    } catch (error) {
      UserDomain.commands.setError(error.message || "Unknown error");
    }
  },
};
