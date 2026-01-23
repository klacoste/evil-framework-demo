import { createDomain } from "../framework/createDomain";

export const SearchQueryDomain = createDomain({
  initialState: {
    query: "",
  },
  commands: {
    setQuery(state, query) {
      return { query };
    },
  },
  selectors: {
    getQuery(state) {
      return state.query;
    },
  },
});
