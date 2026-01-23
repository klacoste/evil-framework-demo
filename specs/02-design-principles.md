## Design Principles

The following principles guide all design decisions in this framework. They are not goals in the abstract; they are constraints that deliberately shape how state, rendering, and side effects are modeled. Each principle exists to reduce ambiguity, improve debuggability, and make the system easier to reason about—by both humans and AI agents.

### 1. Explicit over implicit

All important behavior should be visible in code, not inferred from conventions or lifecycle timing. Data ownership, update paths, and side effects must be declared explicitly rather than emerging indirectly from framework magic. If a change affects part of the system, it should be possible to see *why* by reading the relevant module, without knowing hidden rules.

This favors clarity and predictability over terseness or cleverness.

### 2. Clear ownership of data and effects

Every piece of state has a well-defined owner, and only that owner is responsible for mutating it. Side effects (network requests, persistence, analytics, etc.) are modeled as explicit operations rather than being embedded inside rendering or reactive callbacks.

This makes it possible to answer basic questions quickly:

* Who is allowed to change this data?
* What happens when it changes?
* Where do side effects originate?

### 3. Architecture that is legible to machines

The framework is designed to be understandable not only by humans, but also by AI agents that generate, modify, and analyze code. This means favoring:

* Stable, explicit APIs
* Strong contracts and schemas
* Predictable control flow

If a behavior depends on subtle timing, implicit dependency tracking, or undocumented conventions, it becomes harder for agents to work safely—and harder for humans to review their output.

### 4. Structure over flexibility

In large, long-lived applications, unrestricted flexibility tends to increase cognitive load over time. This framework prefers a smaller number of well-defined patterns that are consistently applied across the codebase.

While escape hatches exist, the default path should guide developers—and agents—toward correct, boring solutions that scale socially, not just technically.

### 5. Debuggability as a first-class concern

The system should make it easy to answer:

* What changed?
* Why did it change?
* What code triggered this behavior?

State transitions and side effects should be inspectable without requiring local reproduction or deep framework knowledge. Debugging is not an afterthought layered on top of runtime behavior; it is a primary design constraint.

### 6. Simple primitives, composed deliberately

Rather than building complex pipelines or deeply nested abstractions, the framework is composed from small, focused primitives that do one thing well. More complex behavior emerges from explicit composition, not hidden orchestration.

This aligns with both human reasoning and agent workflows: small pieces are easier to generate correctly, test in isolation, and recombine safely.

### 7. Familiar mental models where they help

The framework borrows from established patterns in the React ecosystem where they improve approachability and adoption. However, familiarity is not treated as a goal in itself. When existing patterns rely on implicit behavior or obscure control flow, they are reconsidered in favor of clearer alternatives.

The aim is not novelty, but clarity.
