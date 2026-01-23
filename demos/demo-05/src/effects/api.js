const delayProfile = 600;
const delayDashboard = 800;

export const api = {
  fetchProfile(userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ id: userId, name: "Morgan Lee" });
      }, delayProfile);
    });
  },
  fetchDashboard(userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, label: "Active projects", value: 3, userId },
          { id: 2, label: "Pending reviews", value: 7, userId },
          { id: 3, label: "Unread notes", value: 12, userId },
        ]);
      }, delayDashboard);
    });
  },
};
