import { api } from "../effects/api";

export const ServerService = {
  async simulateServerEdit() {
    await api.simulateServerEdit();
  },
};
