# Demo 09 — Collaborative Text (CRDT)

This demo shows honest CRDT collaboration with explicit boundaries: the UI layer stays pure and observable, while a worker owns the Yjs document, WebSocket replication, and IndexedDB durability.

```
UI thread = framework domains + services + views
Worker = CRDT engine (Yjs) + WebSocket + IndexedDB
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

## How to demo (two tabs)

1. Open the app in two tabs.
2. Click “Connect” in each tab.
3. Type in both tabs; watch text converge.
4. Go offline in Tab A, keep typing; keep typing online in Tab B.
5. Go online in Tab A and click “Connect”; text reconciles after the handshake.

## Manual Test Checklist

1. Start server + app: status `idle`, disconnected, textarea loads (possibly empty).
2. Click “Connect” in Tab A:
   - status `connecting → connected`
   - event log shows `CONNECT`
3. Type “hello” in Tab A:
   - Tab A shows text immediately
4. Click “Connect” in Tab B:
   - Tab B receives the current text (handshake)
5. Type in both tabs concurrently:
   - text converges in both tabs within a moment (merge behavior)
6. In Tab A: toggle offline, keep typing.
7. In Tab B: keep typing while online.
8. In Tab A: toggle online and click “Connect”:
   - text converges after handshake
   - stats/event log reflect remote updates and reconciliation
9. Refresh Tab A while offline:
   - textarea restores from IndexedDB snapshot
