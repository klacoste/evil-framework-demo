# Demo 08 — Sync Engine Infra

This demo shows the framework ideals holding up over real browser infrastructure: state and outbox are durable in IndexedDB, sync runs inside a WebWorker, and a real WebSocket server provides authoritative updates, all while UI state and workflows remain explicit and debuggable.

```
UI Thread: domains + services + views
        ↕ v1 message protocol
Worker: IndexedDB + WebSocket + sync engine
```

## Run

Terminal 1:
```
npm install
npm run server
```

Terminal 2:
```
npm run dev
```

## Manual Test Checklist

1. Start server + app: local title `Buy milk`, version `1`, outbox empty, status `idle`, disconnected.
2. Click “Connect”: status goes `connecting → idle`, connection shows connected.
3. Type while online: local title updates immediately; outbox stays ~`1` while typing (coalesced).
4. Observe auto-sync: outbox clears; local version increments; status returns to `idle` without clicking “Sync now”.
5. Open a second tab and click “Connect” there:
   - In tab B, click “Simulate server edit”.
   - In tab A, observe “last known server” updates (server push).
6. In tab A: go offline; keep typing (outbox persists).
7. In tab B: click “Simulate server edit” again.
8. In tab A: go online → click “Connect” → status becomes `conflict` and conflict panel appears (auto-sync triggers).
9. Resolve:
   - “Use server” clears outbox and adopts server title/version.
   - Repeat and choose “Keep mine” rebases + retries; outbox clears; server ends with your title.
10. With pending outbox, refresh tab A while offline: todo title + outbox are restored from IndexedDB.
