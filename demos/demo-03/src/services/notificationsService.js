import { api } from "../effects/api";

export const NotificationsService = {
  async fetchNotifications(userId) {
    return api.fetchNotifications(userId);
  },
};
