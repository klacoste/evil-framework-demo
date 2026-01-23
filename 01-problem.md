## Problem

Large web applications are hard to build and maintain—not because the browser is lacking, but because **complexity accumulates faster than our ability to reason about it**.

As applications grow, so do the number of features, developers, state transitions, side effects, and integration points. Over time, even well-intentioned codebases tend to drift toward systems where:

* It’s unclear who owns a piece of data or is responsible for updating it
* Side effects are triggered indirectly through lifecycle hooks or conventions
* Changes in one area cause unexpected behavior elsewhere
* Debugging requires deep framework knowledge or local reproduction of subtle state

Most modern front-end frameworks do a good job of solving *some* of these problems, but they largely assume a development model where humans write and maintain most of the code directly and therefore optimize for developer ergonomics more than system inspectability. That assumption is becoming less true.

Increasingly, engineers work **with AI agents** to generate new features, refactor existing code, and investigate bugs. In this workflow, developers spend less time writing code line-by-line and more time:

* Describing intent
* Reviewing generated changes
* Debugging unexpected behavior
* Guiding agents toward correct solutions

This shift changes what a front-end framework should optimize for. Patterns that rely on implicit behavior, hidden dependencies, or clever abstractions are harder—not easier—for agents to reason about. The same is true for humans reviewing agent-generated code. What helps both is the same thing: **explicit structure, clear contracts, and predictable behavior**.

At the same time, the target environment is still a “large web application” in the practical sense:

* Multiple developers with mixed experience levels
* Long-lived codebases that must evolve incrementally
* Web-first architectures backed by reliable servers
* A need for fast onboarding and safe change, not maximal flexibility

Given that many workable frameworks already exist, the question is not how to invent something entirely new. The question is whether we can design a framework that **materially improves software quality** by making application architecture easier to inspect, reason about, and modify—by both humans and AI agents.

In other words:
How can we organize JavaScript code so that state, side effects, and updates are explicit enough that most development work can be safely delegated to agents, while humans remain confident they understand what the system is doing and why?

That is the problem this framework attempts to address.
