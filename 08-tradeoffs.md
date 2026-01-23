## Tradeoffs and Limitations

This framework deliberately prioritizes clarity, explicit structure, and debuggability over flexibility and minimal abstraction. That choice comes with real tradeoffs.

First, this approach is more verbose than many modern frameworks. Explicit domains, services, and effect boundaries require more upfront structure than colocating logic directly in components. For small applications or prototypes, this overhead may not be justified.

Second, the framework constrains where certain logic may live. Business workflows belong in services, state changes belong in domains, and side effects belong in effect handlers. While escape hatches exist, working against these boundaries is intentionally frictional. This can feel restrictive to developers accustomed to highly flexible component-centric patterns.

Third, this model optimizes for *reasoning and maintenance*, not maximum rendering performance. While selector-based subscriptions avoid unnecessary re-renders, the framework does not attempt fine-grained reactive graph optimization or compile-time dependency analysis. In performance-critical UI scenarios, other approaches may be more appropriate.

Finally, this architecture assumes a web-first, server-backed application. While offline support can be built on top of these primitives, the framework does not treat local-first synchronization or conflict resolution as foundational concerns.

These limitations are intentional. The framework is designed for large, long-lived applications where onboarding speed, safe change, and debuggability matter more than terseness or raw performance.
