## State Domains and State Updates

State domains are the foundation of the framework. They define what data exists, who owns it, and how it may change over time. All other layers—services, effects, and UI—interact with state exclusively through domain interfaces.

The primary goal of state domains is to make **data ownership and change explicit**.

---

### What is a State Domain?

A state domain is a cohesive unit that owns:

* A well-defined slice of application state
* The allowed transitions for that state
* The invariants that must always hold

A domain does **not**:

* Perform side effects
* Know about UI components
* Reach into other domains’ internal state

This keeps domains predictable, testable, and easy to reason about in isolation.

---

### Domain Structure

A typical domain is defined by three parts:

1. **State shape**
2. **Commands (write operations)**
3. **Selectors (read operations)**

All three are explicit and colocated.

```js
// userDomain.js
const UserDomain = createDomain({
  name: "user",

  state: {
    currentUser: null,
    status: "idle", // "idle" | "loading" | "error"
    error: null,
  },

  commands: {
    setUser(state, user) {
      return {
        ...state,
        currentUser: user,
        status: "idle",
        error: null,
      };
    },

    setLoading(state) {
      return {
        ...state,
        status: "loading",
      };
    },

    setError(state, error) {
      return {
        ...state,
        status: "error",
        error,
      };
    },
  },

  selectors: {
    isAuthenticated(state) {
      return Boolean(state.currentUser);
    },
  },
});
```

This structure is intentionally explicit:

* State mutations are centralized
* Valid transitions are visible
* There is no hidden write access

---

### Commands as the Only Write Path

State may only be modified by executing a domain command. Commands are synchronous and deterministic. They:

* Take the current state and input
* Return the next state
* Perform no side effects

This constraint ensures:

* State transitions can be logged and inspected
* Updates are replayable
* Agents can safely generate or modify commands without worrying about hidden behavior

```js
UserDomain.commands.setLoading();
UserDomain.commands.setUser(userData);
```

If a state change requires a network request, persistence, or analytics, that logic lives outside the domain and invokes commands explicitly after completion.

---

### Selectors Define Read Access

Domains expose selectors to describe how state is consumed.

Selectors:

* Are pure functions
* Encapsulate derived logic
* Provide a stable read interface for UI and services

```js
const isLoggedIn = UserDomain.selectors.isAuthenticated();
```

This avoids scattering derived logic across components and keeps read access consistent.

---

### Domain Isolation and Composition

Domains do not reach into each other’s internal state. If coordination is required, it happens at the **application service** level.

For example, logging out a user might involve:

* Clearing user state
* Clearing cached data in another domain
* Triggering analytics

Each domain remains isolated; orchestration happens elsewhere.

This prevents tight coupling and makes refactoring safe.

---

### Why This Model

This approach deliberately trades some flexibility for clarity:

* There is one place to look for state changes
* One way to update state
* One way to read derived data

For large applications and agent-assisted workflows, this predictability matters more than minimizing boilerplate. Agents can generate commands, tests, and selectors reliably because the rules are explicit and enforced.

State domains become the most stable part of the system—the layer least likely to change as UI frameworks, rendering strategies, or tooling evolve.
