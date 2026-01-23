import { createDomain } from "../framework/createDomain";

export const NotificationsDomain = createDomain({
  initialState: {
    notifications: [],
  },
  commands: {
    setNotifications(state, list) {
      return { notifications: list };
    },
    clearNotifications() {
      return { notifications: [] };
    },
  },
  selectors: {
    getNotifications(state) {
      return state.notifications;
    },
    hasNotifications(state) {
      return state.notifications.length > 0;
    },
  },
});
