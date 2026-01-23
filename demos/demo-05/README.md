# Demo 05 — Logout Invalidation

This demo enforces hard session invalidation and ensures late data never re-enters the system.

- AuthDomain is the authority for session validity.
- SessionService owns initialization and revocation.
- Late effect responses are ignored via a session token.

## What to look for

- Logout clears all user-scoped domains immediately.
- Loading state is purely descriptive.
- Late responses never repopulate cleared domains.

## Run locally

Requirements: Node.js 18+ and npm.

```sh
cd demos/demo-05
npm install
npm run dev
```

Open the URL printed by Vite in the terminal output.

## Build

```sh
cd demos/demo-05
npm run build
npm run preview
```
