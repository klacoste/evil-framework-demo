# Demo 01 — Counter with Derived State

This demo validates the core framework ideas on a tiny, explicit example:

- A single state domain owns all counter state.
- Commands are the only write path.
- Selectors provide derived state for the UI.
- UI components subscribe explicitly via `useSelector`.
- Re-renders are predictable and driven by selector output changes.

No services, side effects, async logic, routing, or persistence are included.

## What to look for

- Buttons call domain commands directly (no intermediate handlers).
- UI reads only through selectors, never raw state.
- Derived values (even/odd, sign) update deterministically.

## Run locally

Requirements: Node.js 18+ and npm.

```sh
cd demo-01
npm install
npm run dev
```

Open the URL printed by Vite in the terminal output.

## Build

```sh
cd demo-01
npm run build
npm run preview
```
