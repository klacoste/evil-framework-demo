## Why Not Existing Approaches?

This framework draws inspiration from existing tools, but makes different tradeoffs in several key areas.

**Why not rely on implicit reactivity or signals?**
Implicit dependency tracking can produce very efficient updates, but it also obscures why a particular change occurred. In large systems—especially those modified by AI agents—explicit dependencies are easier to inspect, review, and reason about than reactive graphs inferred at runtime.

**Why not colocate side effects in components (e.g. hooks or effects)?**
Component-level side effects tend to couple business logic to rendering behavior and lifecycle timing. This makes complex workflows harder to follow and increases the risk of duplicated or unintended execution. Centralizing workflows in services makes intent explicit and behavior easier to audit.

**Why not a single global store?**
Unstructured global state makes ownership ambiguous and refactoring risky. Domain-based state encourages clear responsibility boundaries while still supporting shared application data.

**Why not just use React with conventions?**
React is a powerful rendering library, but many of the problems described here emerge from how applications are structured around it, not from React itself. This framework treats architecture as a first-class concern and encodes it into enforceable boundaries rather than relying on conventions and discipline alone.

These choices are not claims of superiority, but of fit. Different problems require different tradeoffs.
