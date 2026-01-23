import { SearchLoadDomain } from "../domains/searchLoadDomain";
import { SearchQueryDomain } from "../domains/searchQueryDomain";
import { SearchResultsDomain } from "../domains/searchResultsDomain";
import { api } from "../effects/api";

let debounceHandle = null;

export const SearchService = {
  updateQuery(query) {
    SearchQueryDomain.commands.setQuery(query);

    if (query === "") {
      SearchResultsDomain.commands.clearResults();
      SearchLoadDomain.commands.setIdle();

      if (debounceHandle) {
        clearTimeout(debounceHandle);
        debounceHandle = null;
      }

      return;
    }

    if (SearchResultsDomain.selectors.hasResults(SearchResultsDomain.getState())) {
      SearchLoadDomain.commands.setStale(true);
    }

    if (debounceHandle) {
      clearTimeout(debounceHandle);
    }

    debounceHandle = setTimeout(async () => {
      SearchLoadDomain.commands.setLoading();
      SearchLoadDomain.commands.incrementInFlight();

      const intent = query;

      try {
        const results = await api.search(intent);

        const latestQuery = SearchQueryDomain.selectors.getQuery(
          SearchQueryDomain.getState()
        );
        if (latestQuery !== intent) {
          return;
        }

        SearchResultsDomain.commands.setResults(results, intent);
        SearchLoadDomain.commands.setStale(false);
      } finally {
        SearchLoadDomain.commands.decrementInFlight();

        const count = SearchLoadDomain.selectors.getInFlightCount(
          SearchLoadDomain.getState()
        );

        if (count === 0) {
          SearchLoadDomain.commands.setIdle();
        }
      }
    }, 100);
  },
};
