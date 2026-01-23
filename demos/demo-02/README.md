# Demo 02 — Async User Loader

This demo extends the framework with async workflows using explicit services and effect handlers.

- UI components subscribe via selectors only.
- Services coordinate async behavior and issue commands.
- Effects encapsulate external interactions.
 
The mock API alternates between success and error on each request.

## What to look for

- `UserService.loadUser()` drives the entire flow.
- Domain commands are the only write path.
- Loading/error/success render paths are explicit and side-effect-free.

## Run locally

Requirements: Node.js 18+ and npm.

```sh
cd demos/demo-02
npm install
npm run dev
```

Open the URL printed by Vite in the terminal output.

## Build

```sh
cd demos/demo-02
npm run build
npm run preview
```
