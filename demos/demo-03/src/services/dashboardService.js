import { AuthUserDomain } from "../domains/authUserDomain";
import { DashboardLoadDomain } from "../domains/dashboardLoadDomain";
import { NotificationsDomain } from "../domains/notificationsDomain";
import { PreferencesDomain } from "../domains/preferencesDomain";
import { NotificationsService } from "./notificationsService";
import { PreferencesService } from "./preferencesService";
import { UserService } from "./userService";

export const DashboardService = {
  async initializeDashboard() {
    DashboardLoadDomain.commands.setLoading();

    try {
      const user = await UserService.fetchUser();
      const [notifications, preferences] = await Promise.all([
        NotificationsService.fetchNotifications(user.id),
        PreferencesService.fetchPreferences(user.id),
      ]);

      AuthUserDomain.commands.setUser(user);
      NotificationsDomain.commands.setNotifications(notifications);
      PreferencesDomain.commands.setPreferences(preferences);

      DashboardLoadDomain.commands.setIdle();
    } catch (error) {
      AuthUserDomain.commands.clearUser();
      NotificationsDomain.commands.clearNotifications();
      PreferencesDomain.commands.clearPreferences();

      DashboardLoadDomain.commands.setError(error.message || "Unknown error");
    }
  },
};
