# Demo 03 — Atomic Dashboard Initialization

This demo validates a multi-domain, multi-service workflow that remains atomic from the UI’s perspective.

- UI emits intent only (no direct domain commands).
- DashboardService orchestrates all cross-domain work.
- Effects are deterministic mocks for reproducibility.
- Entity state and process state are kept separate.

## What to look for

- Dashboard only renders when all domains have data.
- Any failure clears all entity domains and surfaces an error.
- “Open Dashboard” is both initial load and retry.

## Run locally

Requirements: Node.js 18+ and npm.

```sh
cd demos/demo-03
npm install
npm run dev
```

Open the URL printed by Vite in the terminal output.

## Build

```sh
cd demos/demo-03
npm run build
npm run preview
```
