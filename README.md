# Evil Framework Demo

This repo captures a framework proposal and a set of demos that test its design constraints in practice.
Specs define the rules; demos stress-test those rules in progressively harder scenarios, with an emphasis on explicit state ownership, side-effect isolation, and agent-friendly workflows.

Start with `specs/` for the framework write-up, then review `demos/` for concrete implementations.

## Demo Progression

The demos are ordered to **progressively tighten constraints**, not to accumulate features. Each demo exists to invalidate a class of tempting but harmful abstractions, and to make incorrect implementations structurally awkward.

These demos are designed for **agentic workflows**: every rule is explicit, every boundary is named, and no behavior relies on convention or inference.

---

### **Demo 1 — Deterministic State & Rendering**

**Invariant:** *State has a single owner, and rendering is a pure reaction to declared dependencies.*

* Single state domain
* Synchronous commands
* Explicit selectors and subscriptions
* UI may call domain commands directly (permitted looseness)

**Purpose:** Establish the mechanical vocabulary of the framework without distraction.

**What it invalidates:** Implicit state access, magical reactivity, hidden data flow.

---

### **Demo 2 — Async Workflow & Process State**

**Invariant:** *Time and failure must be modeled explicitly.*

* Entity state split from process state
* Async logic lives only in application services
* Side effects isolated in effect handlers
* UI reacts to loading, success, and error states

**Purpose:** Introduce time as a structural concern.

**What it invalidates:** Async logic in components, conflated loading/data state.

---

### **Demo 3 — Atomic Multi-Domain Orchestration**

**Invariant:** *Cross-domain truth must have a single coordinator.*

* Multiple entity domains
* Explicit process domain
* Atomic workflow (all-or-nothing)
* UI emits intent only; services own orchestration

**Purpose:** Stress-test the architecture under realistic coordination.

**What it invalidates:** Partial state, UI-driven orchestration, distributed workflow logic.

This is the **keystone demo**: the framework either holds here or it doesn’t.

---

### Demo 4 — Non-Atomic / Progressive Workflows

**Invariant:** *Relaxing atomicity requires new rules, not exceptions.*

- Progressive data availability
- Staged rendering by design
- Explicit modeling of stale, partial, and concurrent state
- Time-based coordination (e.g. debounce) treated as orchestration, not correctness

**Purpose:** Explore what breaks when atomic guarantees are intentionally relaxed — and what must replace them.

**What it invalidates:** Ad-hoc partial rendering, implicit “eventually consistent” UI.

---

### **Demo 5 — Long-Lived State & Invalidation**

**Invariant:** *State must remain explainable over time, not just at initialization.*

* Invalidation and revocation (logout)
* Session transitions (logout + re-init via login)

**Purpose:** Model real application lifespan.

**What it invalidates:** Assumptions that state is short-lived or monotonic.

---

### **Demo 6 — Counter Without React (Naive DOM Render Pipeline)**

**Invariant:** *Rendering is an adapter; the architecture should not depend on a specific UI library.*

* Vanilla DOM rendering (no React)
* Explicit selector subscriptions drive re-renders
* Full subtree replacement per mount (intentionally non-optimized)

**Purpose:** Prove the framework’s state/update model can drive UI without React.

**What it invalidates:** Treating React (or a VDOM) as a required part of the architecture.

---

### **Demo 7 — Offline Operation & Conflict Resolution (Outbox + Versioning)**

**Invariant:** *Offline, sync, and conflicts must be explicit state and named workflows — not background magic.*

* Optimistic local edits + durable outbox of pending operations
* Deterministic sync with version-based conflict detection
* Conflicts represented explicitly and resolved via a visible workflow

**Purpose:** Demonstrate a minimal offline/sync/conflict pipeline that stays within the framework boundaries.

**What it invalidates:** Silent overwrites, UI-inferred freshness, and “eventual consistency by coincidence.”
