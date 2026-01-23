import { createDomain } from "../framework/createDomain";

export const DashboardDataDomain = createDomain({
  initialState: {
    items: [],
  },
  commands: {
    setItems(state, items) {
      return { items };
    },
    clearItems() {
      return { items: [] };
    },
  },
  selectors: {
    getItems(state) {
      return state.items;
    },
    hasItems(state) {
      return state.items.length > 0;
    },
  },
});
