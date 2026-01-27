# Demo 07: Offline + Conflict Resolution

This demo proves offline operation, outbox-based sync, version conflicts, and
explicit user-driven resolution with a deterministic mock server.

It attempts to provide a credible shape (outbox + version check + explicit conflict state), but real offline/conflict resolution would require deep domain rules and careful sync semantics. The patterns explored here are a starting point, not a solution.

## State model

- ConnectivityDomain
- TodoDomain
- OutboxDomain
- SyncDomain
- ConflictDomain

## Workflow

Edit → enqueue → sync → conflict → resolve.

## Key Highlights

### Offline edits = optimistic state + outbox

Typing updates local entity state immediately and records intent as an operation (coalesced while typing).

```js
// src/services/todoService.js
TodoDomain.commands.setTitle(nextTitle);
OutboxDomain.commands.coalescePatchTitle({
  type: "patchTitle",
  patch: { title: nextTitle },
  baseVersion: todo.version,
});
```

### Deterministic conflict detection (version mismatch)

The mock server rejects ops when the client’s `baseVersion` is stale.

```js
// src/effects/api.js
if (op.baseVersion !== serverTodo.version) {
  return { ok: false, conflict: { opId: op.opId, serverTodo: { ...serverTodo } } };
}
```

### Conflicts are explicit state (not magic merges)

Sync moves into a `conflict` status and stores a conflict payload for the UI to render.

```js
// src/services/syncService.js
SyncDomain.commands.setConflict();
ConflictDomain.commands.setConflict({ opId, minePatch, serverTodo });
```

### Two explicit resolution strategies

“Keep mine” rebases the patch onto the server’s current version and retries sync.

```js
// src/services/conflictService.js
OutboxDomain.commands.enqueue({
  type: "patchTitle",
  patch: conflict.minePatch,
  baseVersion: conflict.serverTodo.version,
});
await SyncService.syncNow();
```

## Run

```bash
npm install
npm run dev
```

Note: the “server” is a deterministic in-memory mock.

## Testing Checklist

1. Start the app: initial title `Buy milk`, version `1`, pending ops `0`, status `idle`.
2. Type in the title (online): title updates immediately; pending ops becomes `1` and stays `1` as you keep typing.
3. Go offline and keep typing: title still updates; pending ops stays `1`.
4. While offline, click “Simulate server edit”: local title should not change.
5. Click “Sync now” while offline: status becomes `error` (“Offline…”); pending ops stays `1`.
6. Go online and click “Sync now”: status becomes `conflict` and the conflict panel appears.
7. Resolve:
   - “Use server”: adopts server title/version, clears outbox, returns to `idle`.
   - Repeat conflict path, then “Keep mine”: rebases + retries, clears outbox, returns to `idle` with your title applied.
