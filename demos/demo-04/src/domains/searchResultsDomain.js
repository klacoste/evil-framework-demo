import { createDomain } from "../framework/createDomain";

export const SearchResultsDomain = createDomain({
  initialState: {
    results: [],
    resultForQuery: null,
  },
  commands: {
    setResults(state, results, query) {
      return {
        results,
        resultForQuery: query,
      };
    },
    clearResults() {
      return {
        results: [],
        resultForQuery: null,
      };
    },
  },
  selectors: {
    getResults(state) {
      return state.results;
    },
    getResultQuery(state) {
      return state.resultForQuery;
    },
    hasResults(state) {
      return state.results.length > 0;
    },
  },
});
