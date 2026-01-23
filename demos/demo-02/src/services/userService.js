import { UserDomain } from "../domains/userDomain";
import { UserLoadDomain } from "../domains/userLoadDomain";
import { api } from "../effects/api";

export const UserService = {
  async loadUser() {
    UserDomain.commands.clearUser();
    UserLoadDomain.commands.setLoading();

    try {
      const user = await api.fetchUser();
      UserDomain.commands.setUser(user);
      UserLoadDomain.commands.setIdle();
    } catch (error) {
      UserLoadDomain.commands.setError(error.message || "Unknown error");
    }
  },
};
