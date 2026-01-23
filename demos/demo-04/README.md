# Demo 04 — Progressive Search

This demo models a deliberately non-atomic workflow with explicit stale state.

- Query intent is tracked separately from visible results.
- Staleness is explicit state owned by the load domain.
- Services coordinate debouncing and stale protection.

## What to look for

- Results remain visible while new requests are loading.
- Stale results are clearly marked.
- Older responses never overwrite newer intent.
- Clearing the query resets results and load state.

## Run locally

Requirements: Node.js 18+ and npm.

```sh
cd demos/demo-04
npm install
npm run dev
```

Open the URL printed by Vite in the terminal output.

## Build

```sh
cd demos/demo-04
npm run build
npm run preview
```
