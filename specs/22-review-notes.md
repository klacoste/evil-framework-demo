# Review Notes (After Demos 6–10)

## What We’ve Learned

* “Explicit domains + services + effects” scales to harder problems: offline/outbox/conflict (Demo 7), real infra boundaries (Demo 8), CRDT replication (Demo 9).
* The *boundary idea* is the strongest through-line: when WS/IDB/Workers/CRDT live behind an engine/effects adapter, the UI remains explainable and reviewable.
* Demo 6 was a useful falsification: full subtree replacement breaks real UI invariants (focus/selection) and makes event lifecycle too easy to get wrong.
* A small “parts-based” renderer (Demo 10) is enough to regain usability without turning rendering into implicit magic, as long as dependency tracking stays explicit (selectors).
* Async ordering is where correctness actually lives: Demo 8’s deadlock shows that serializing the wrong work can wedge the whole system even with “simple” code.

---

## Obvious Framework Changes To Adopt

* Make `createDomain` commands support arguments (`command(state, ...args)`), not just `command(state)`.
* Promote “scope + disposal” to a first-class primitive (AbortController + unsubscribers): it belongs in the official rendering/effects story, not as an ad-hoc pattern.
* Standardize an engine boundary for “real infra”: a versioned message protocol + explicit status/events (Demo 8/9).
* Treat “observability state” as a design requirement: explicit process domains (status, errors) + bounded event logs/counters are how async systems stay debuggable (Demo 8/9).
* Codify a renderer contract: stable nodes, explicit parts, explicit cleanup; ban subtree replacement as the default update mechanism (Demo 10).

---

## Clear Wins

* High legibility for review (human + agent): clear ownership, few hidden interactions, changes localize to “domain/service/effect/view”.
* Debuggability: explicit status machines and event logs make failure modes visible instead of “it didn’t sync”.
* Swapability: renderer and infra are adapters; we upgraded from localStorage/fake API → IDB/Worker/WS → Yjs without rewriting the whole app.

---

## Main Risks / Open Problems

* Ergonomics can drift into boilerplate unless patterns are enforced and small standardized helpers exist (protocol helpers, engine adapters, template helpers).
* “No implicitness” is good, but you still need structured convenience; otherwise people/agents reintroduce implicitness ad-hoc.
* Rendering: Demo 10’s renderer is a solid baseline, but real apps will demand more primitives (lists/conditionals, keyed repetition, better caret handling under remote edits). Those must be added carefully to avoid becoming a half-baked framework.
* State model scaling: stronger contracts (TypeScript or rigorous JSDoc + runtime validation) become important as domains/services proliferate, otherwise schema drift is likely.
* Testing story: without a “golden path” harness (especially for engine/protocol ordering), regressions in async behavior and cleanup will recur.

---

## Is The Philosophy Sound? Will It Produce More Stable Apps?

Yes—if boundaries stay enforceable and contracts stay explicit. The demos show the approach can handle increasingly “real” complexity without collapsing into lifecycle magic. Stability comes less from any single technique and more from enforced separation: pure state transitions, explicit orchestration, and isolated effects with observable state.

The next high-value steps to make this production-ready are:

1. Standardize engine/effects protocol and lifecycle patterns.
2. Make the parts-based renderer the default with a small, disciplined feature set.
3. Add contract tooling (types/validation) plus minimal integration tests around ordering and cleanup.

---

## Criticisms / Risks (Agent-Written Code, Human-Reviewed)

These are the likely holes critics will point to when measuring the approach against the stated goals (“agents write code, humans review it”).

* **Verbosity tax:** Explicit domains/services/effects + message protocols create more files and glue. Agents can generate it, but humans pay the review cost.
* **Complexity displacement:** Banning implicit lifecycle behavior moves complexity into orchestration (services/engines/state machines). Bugs become ordering/idempotency issues that are harder to spot in review than local UI mistakes.
* **Boundary enforcement gap:** Rules like “only the worker touches WS/IDB/CRDT” are easy to violate unless enforced by linting/module boundaries. Otherwise reviewers become boundary police.
* **Schema drift without contracts:** If state/protocol shapes aren’t enforced (TypeScript, runtime validation, schema tests), agents will subtly change payloads or domain state and reviewers won’t reliably catch it.
* **Renderer treadmill:** A “dumb” parts renderer is viable, but real apps quickly demand lists/conditionals/keyed moves/a11y patterns. Each added feature risks recreating implicitness or shipping a buggy half-framework.
* **Performance uncertainty:** Without a mature UI framework, update costs and batching semantics need explicit attention. Agent changes can regress perf in non-obvious ways; reviewers lack standard heuristics/tooling.
* **Observability misuse risk:** Event logs and counters help, but agents can accidentally make them unbounded or semantically inconsistent, turning observability into noise.
* **Testing burden shifts earlier:** The approach is testable, but it needs a harness for async ordering, idempotency, and cleanup. Without it, concurrency bugs will recur.
* **Ergonomics tradeoff:** “No implicit dependencies” improves explainability but can feel heavy or unidiomatic. Approachability and velocity may suffer for new contributors even if agents comply.
* **Ecosystem integration friction:** Many libraries assume React/Solid/Vue patterns. A custom architecture can increase bespoke adapter code that agents must maintain.
