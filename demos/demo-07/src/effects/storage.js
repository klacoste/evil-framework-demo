const STORAGE_KEY = "demo-07-snapshot";

export const storage = {
  async loadSnapshot() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  },
  async saveSnapshot(snapshot) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  },
};
