## Anti-Patterns This Framework Avoids

The following patterns are common in modern front-end frameworks and applications. While many of them are workable in small or highly experienced teams, they tend to become liabilities in large, long-lived codebases—especially when most code changes are produced or assisted by AI agents. This framework intentionally avoids these patterns in favor of more explicit and inspectable alternatives.

### 1. Implicit lifecycle-driven behavior

Patterns where important work happens “because the framework runs it” at a particular lifecycle phase are avoided. Examples include side effects that fire due to render timing, dependency inference, or component mount order.

When behavior depends on subtle lifecycle rules, both humans and agents must internalize hidden framework knowledge to reason about correctness. This framework favors explicit operations over lifecycle hooks that execute indirectly.

### 2. Hidden data dependencies

Implicit subscriptions, automatic dependency tracking, or magic reactivity can obscure which parts of the system depend on which data. While convenient in small scopes, this makes it difficult to understand why a change caused a particular update.

Instead of inferring dependencies at runtime, this framework prefers declaring them explicitly so that data flow can be inspected, documented, and reasoned about without guesswork.

### 3. Side effects embedded in rendering logic

Embedding network requests, persistence, analytics, or other side effects inside rendering or reactive callbacks couples business logic to UI execution order. This often leads to duplicated requests, brittle dependency arrays, or workarounds to suppress unintended behavior.

This framework treats side effects as first-class operations that are defined outside of rendering concerns and invoked deliberately.

### 4. Overly flexible global state

Unstructured global state that any part of the application can read from or write to quickly becomes a source of accidental coupling. In large applications, this makes it hard to determine responsibility, enforce invariants, or safely refactor.

Rather than a single amorphous global store, this framework favors clearly bounded state domains with explicit ownership and update paths.

### 5. Clever pipelines and abstraction layers

Highly abstract pipelines—where data flows through multiple implicit transformations—can be elegant on paper but are difficult to debug in practice. When something goes wrong, it is often unclear which stage caused the issue or how to intervene.

This framework prioritizes straightforward composition of simple primitives over clever orchestration, even if that results in slightly more verbose code.

### 6. Convention without enforcement

Relying on “the right way to do things” without enforcement works only as long as every contributor shares the same mental model. In reality, teams grow, contributors change, and AI agents generate code that follows rules literally, not culturally.

Where conventions matter, this framework encodes them into APIs and structure rather than relying on documentation alone.

### 7. Framework behavior that is hard to observe

Systems where state transitions or side effects cannot be inspected without specialized tooling or reproduction in a local environment slow down debugging and erode confidence.

This framework avoids designs where core behavior is opaque by default, favoring structures that make changes visible and attributable.
