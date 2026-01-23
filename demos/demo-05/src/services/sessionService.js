import { AuthDomain } from "../domains/authDomain";
import { DashboardDataDomain } from "../domains/dashboardDataDomain";
import { SessionLoadDomain } from "../domains/sessionLoadDomain";
import { UserProfileDomain } from "../domains/userProfileDomain";
import { api } from "../effects/api";

let currentSessionToken = 0;

export const SessionService = {
  async initializeSession(userId) {
    const sessionToken = ++currentSessionToken;

    SessionLoadDomain.commands.setLoading();
    AuthDomain.commands.login(userId);

    try {
      const profile = await api.fetchProfile(userId);
      if (sessionToken !== currentSessionToken) {
        return;
      }
      UserProfileDomain.commands.setProfile(profile);

      const items = await api.fetchDashboard(userId);
      if (sessionToken !== currentSessionToken) {
        return;
      }

      DashboardDataDomain.commands.setItems(items);
      SessionLoadDomain.commands.setIdle();
    } catch {
      SessionService.logout();
    }
  },
  logout() {
    currentSessionToken += 1;

    AuthDomain.commands.logout();
    UserProfileDomain.commands.clearProfile();
    DashboardDataDomain.commands.clearItems();
    SessionLoadDomain.commands.setIdle();
  },
};
