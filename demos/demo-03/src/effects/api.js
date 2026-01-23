const delay = 650;

let userCalls = 0;
let notificationsCalls = 0;
let preferencesCalls = 0;

export const api = {
  fetchUser() {
    userCalls += 1;
    const shouldFail = userCalls % 4 === 0;

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldFail) {
          reject(new Error("Failed to load user."));
          return;
        }

        resolve({ id: 7, name: "Jordan Park" });
      }, delay);
    });
  },
  fetchNotifications(userId) {
    notificationsCalls += 1;
    const shouldFail = notificationsCalls % 3 === 0;

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldFail) {
          reject(new Error("Failed to load notifications."));
          return;
        }

        resolve([
          { id: 1, label: "Welcome back", userId },
          { id: 2, label: "New comment", userId },
          { id: 3, label: "System update", userId },
        ]);
      }, delay);
    });
  },
  fetchPreferences(userId) {
    preferencesCalls += 1;
    const shouldFail = preferencesCalls % 5 === 0;

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldFail) {
          reject(new Error("Failed to load preferences."));
          return;
        }

        resolve({ theme: "studio", layout: "grid", userId });
      }, delay);
    });
  },
};
