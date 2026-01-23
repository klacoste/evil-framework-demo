## Rendering and Subscription Model

The rendering layer is responsible for turning application state into UI. Its primary job is **not** to manage data or side effects, but to subscribe to state explicitly and re-render predictably when that state changes.

This framework favors a simple, explicit subscription model over implicit reactivity or lifecycle-driven updates.

---

### Subscribing to State Explicitly

UI components declare exactly which pieces of state they depend on by subscribing to domain selectors.

Subscriptions are explicit and static: a component must name the selectors it consumes. There is no automatic dependency inference at render time.

```js
function UserStatus() {
  const user = useSelector(UserDomain.selectors.currentUser);
  const status = useSelector(UserDomain.selectors.status);

  if (status === "loading") return <Spinner />;
  if (!user) return <LoginPrompt />;

  return <Welcome user={user} />;
}
```

By requiring explicit subscriptions:

* It is always clear why a component re-renders
* Agents can safely add or remove dependencies
* Reviewers can reason about data flow without guessing

---

### How Updates Trigger Re-renders

When a domain command executes:

1. The domain computes the next state
2. The framework compares selector outputs
3. Only components subscribed to selectors whose values changed are scheduled to re-render

This is a **selector-driven update model**, not a component-driven one.

Components do not re-render because “something somewhere changed,” but because a value they explicitly depend on changed.

---

### Selector Evaluation and Equality

Selectors are pure functions and are evaluated against the latest domain state.

To avoid unnecessary re-renders:

* Selector results are compared using stable equality rules
* Simple values use referential or primitive equality
* Derived selectors may define custom comparison logic if needed

This keeps update behavior predictable without introducing runtime dependency tracking or fine-grained reactive graphs.

---

### No Render-Time Side Effects

Rendering is a pure operation:

* No side effects
* No data fetching
* No subscriptions created implicitly during render

If an interaction requires work to happen, the component emits intent and delegates behavior to an application service.

```js
<button onClick={() => AuthService.login(credentials)}>
  Log In
</button>
```

This ensures that rendering order, frequency, or batching cannot accidentally trigger business logic.

---

### Scheduling and Batching

State updates are batched automatically within a single tick. Multiple commands executed synchronously result in a single render pass.

Asynchronous updates (e.g., from effects) schedule renders independently, but still respect selector-based subscriptions.

The goal is not maximum rendering performance, but **consistent and understandable update behavior**.

---

### Why This Model

This rendering approach deliberately avoids:

* Automatic dependency tracking
* Render-triggered effects
* Lifecycle-driven subscriptions

In exchange, it provides:

* A clear mental model
* Predictable updates
* Easy debugging
* Strong alignment with agent-assisted workflows

When a component re-renders, there is always a direct, inspectable reason tied to an explicit state dependency.

---

### Summary

Rendering in this framework is declarative but not magical. Components declare what they need, and the framework ensures they update when—and only when—those needs change.

By keeping subscriptions explicit and side-effect-free, the rendering layer remains simple, predictable, and resilient as the application grows.
