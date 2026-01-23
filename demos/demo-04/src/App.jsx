import { SearchLoadDomain } from "./domains/searchLoadDomain";
import { SearchQueryDomain } from "./domains/searchQueryDomain";
import { SearchResultsDomain } from "./domains/searchResultsDomain";
import { SearchService } from "./services/searchService";
import { useSelector } from "./framework/useSelector";
import "./styles.css";

function SearchView() {
  const query = useSelector(SearchQueryDomain.selectors.getQuery);
  const isLoading = useSelector(SearchLoadDomain.selectors.isLoading);
  const isStale = useSelector(SearchLoadDomain.selectors.isStale);
  const inFlightCount = useSelector(
    SearchLoadDomain.selectors.getInFlightCount
  );
  const results = useSelector(SearchResultsDomain.selectors.getResults);
  const hasResults = useSelector(SearchResultsDomain.selectors.hasResults);

  const showEmpty = !hasResults && !isLoading;
  const showLoading = isLoading && !hasResults;
  const showUpdating = isLoading && hasResults;

  return (
    <section className="card">
      <header className="header">
        <div>
          <h1>Search</h1>
          <p className="subtitle">Progressive, explicit results</p>
        </div>
        {isStale && hasResults ? <span className="badge">Stale</span> : null}
      </header>

      <label className="field">
        <span>Search query</span>
        <input
          value={query}
          placeholder="Type to search"
          onChange={(event) => SearchService.updateQuery(event.target.value)}
        />
      </label>

      {showEmpty ? <p className="status">Type to start searching.</p> : null}
      {showLoading ? (
        <p className="status">
          Loading — {inFlightCount} request
          {inFlightCount === 1 ? "" : "s"} in flight
        </p>
      ) : null}
      {showUpdating ? (
        <p className="status">
          Updating — {inFlightCount} request
          {inFlightCount === 1 ? "" : "s"} in flight
        </p>
      ) : null}

      {hasResults ? (
        <ul className="results">
          {results.map((result) => (
            <li key={result.id}>{result.label}</li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

export default function App() {
  return (
    <main className="container">
      <SearchView />
    </main>
  );
}
