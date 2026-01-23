## Application Services and Side Effects

Application services are the layer where **intent becomes behavior**. They coordinate state updates and side effects without owning either directly. This is where business workflows live, while domains remain focused on state and effect handlers remain focused on integration with the outside world.

The purpose of application services is to make complex behavior **explicit, named, and inspectable**.

---

### Role of an Application Service

An application service:

* Receives intent (from UI or system events)
* Invokes effect handlers as needed
* Updates state domains through commands
* Encodes business rules and workflows
* Contains no rendering logic

Services do not mutate state directly and do not perform side effects inline. Instead, they orchestrate those actions through explicit calls.

This separation makes services the primary unit of reasoning for both humans and AI agents.

---

### A Simple Example: User Login

Consider a user login flow that involves:

* Showing a loading state
* Making a network request
* Handling success and failure
* Sending analytics

All of this logic lives in a service.

```js
// authService.js
const AuthService = createService({
  async login(credentials) {
    UserDomain.commands.setLoading();

    try {
      const user = await Effects.api.login(credentials);

      UserDomain.commands.setUser(user);
      Effects.analytics.track("login_success");
    } catch (error) {
      UserDomain.commands.setError(error);
      Effects.analytics.track("login_failure");
    }
  },
});
```

What’s notable here is not the syntax, but the structure:

* State updates are explicit and centralized
* Side effects are named and isolated
* Control flow is readable top-to-bottom
* There is no dependency on UI lifecycle timing

This is intentionally boring—and therefore reliable.

---

### Coordinating More Complex Behavior

Application services are also where more involved workflows live, such as debouncing, retries, caching, or optimistic updates.

For example, a debounced search flow:

```js
// searchService.js
const SearchService = createService({
  search(query) {
    Debounce.run("search", 300, async () => {
      SearchDomain.commands.setLoading(query);

      try {
        const results = await Effects.api.search(query);
        SearchDomain.commands.setResults(results);
      } catch (error) {
        SearchDomain.commands.setError(error);
      }
    });
  },
});
```

Here:

* Debouncing is explicit and named
* The service controls timing
* The domain only reflects state
* Effects remain isolated

There is no hidden reactivity or lifecycle-driven behavior.

---

### Effect Handlers as Integration Boundaries

Effect handlers provide a narrow interface to the outside world. They:

* Encapsulate implementation details (fetch, storage, analytics SDKs)
* Are easily mocked or replaced
* Can be versioned independently of application logic

```js
// effects/api.js
export const api = {
  async login(credentials) {
    return fetch("/api/login", { method: "POST", body: credentials })
      .then(res => res.json());
  },

  async search(query) {
    return fetch(`/api/search?q=${query}`)
      .then(res => res.json());
  },
};
```

From the perspective of a service or agent, effects are just named capabilities.

---

### Why Services Matter for Agent Workflows

Application services provide a stable target for agent-assisted development:

* Agents can generate new services without touching UI code
* Agents can modify workflows without guessing lifecycle rules
* Agents can test services in isolation
* Humans can review intent-level logic instead of diffused side effects

In practice, most meaningful changes in a large application involve modifying services, not components. Making that layer explicit improves safety, reviewability, and long-term maintainability.

---

### Failure Modes This Avoids

By centralizing workflows in services, the framework avoids:

* Duplicated async logic across components
* Dependency-array bugs and accidental re-execution
* Side effects tied to rendering order
* Implicit coupling between UI and business logic

Instead, behavior lives in one place, with a clear name and purpose.

---

### Summary

Application services are the coordination layer of the framework. They encode *what should happen* in response to intent, while delegating *how state changes* and *how effects execute* to specialized layers.

This separation allows the system to remain understandable as complexity grows—and makes it feasible to rely on AI agents for much of the implementation work without sacrificing control or clarity.
