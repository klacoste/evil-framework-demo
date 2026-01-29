import {
  UI_TO_WORKER,
  WORKER_TO_UI,
  createMessage,
  isValidMessage,
} from "../engine/protocol";
import { SyncDomain } from "../domains/syncDomain";
import { TodoDomain } from "../domains/todoDomain";
import { OutboxDomain } from "../domains/outboxDomain";
import { ConflictDomain } from "../domains/conflictDomain";
import { ServerDomain } from "../domains/serverDomain";

let worker = null;
let requestCounter = 0;

function ensureWorker() {
  if (worker) return worker;
  worker = new Worker(new URL("../engine/worker.js", import.meta.url), {
    type: "module",
  });
  worker.addEventListener("message", (event) => {
    const message = event.data;
    if (!isValidMessage(message)) return;
    const { type, payload } = message;

    switch (type) {
      case WORKER_TO_UI.STATUS:
        SyncDomain.commands.setStatus(payload ?? {});
        return;
      case WORKER_TO_UI.SNAPSHOT:
        if (payload?.todo) {
          TodoDomain.commands.setTodo(payload.todo);
        }
        if (payload?.outbox) {
          OutboxDomain.commands.setOps(payload.outbox);
        }
        return;
      case WORKER_TO_UI.CONFLICT:
        ConflictDomain.commands.setConflict(payload?.conflict ?? null);
        return;
      case WORKER_TO_UI.SERVER_TODO:
        ServerDomain.commands.setTodo(payload?.todo ?? null);
        return;
      default:
        return;
    }
  });
  return worker;
}

function send(type, payload, { requestId } = {}) {
  const targetWorker = ensureWorker();
  const message = createMessage({ type, payload, requestId });
  targetWorker.postMessage(message);
}

function nextRequestId() {
  requestCounter += 1;
  return `req_${requestCounter}`;
}

export const EngineService = {
  start() {
    ensureWorker();
  },
  init(clientId) {
    send(UI_TO_WORKER.INIT, { clientId }, { requestId: nextRequestId() });
  },
  loadSnapshot() {
    send(UI_TO_WORKER.LOAD_SNAPSHOT, null, { requestId: nextRequestId() });
  },
  setOnline(isOnline) {
    send(UI_TO_WORKER.SET_ONLINE, { isOnline });
  },
  connect() {
    send(UI_TO_WORKER.CONNECT);
  },
  disconnect() {
    send(UI_TO_WORKER.DISCONNECT);
  },
  enqueuePatchTitle({ opId, title, baseVersion, createdAt }) {
    send(UI_TO_WORKER.ENQUEUE_PATCH_TITLE, {
      opId,
      title,
      baseVersion,
      createdAt,
    });
  },
  syncNow() {
    send(UI_TO_WORKER.SYNC_NOW);
  },
  resolveUseServer() {
    send(UI_TO_WORKER.RESOLVE_USE_SERVER);
  },
  resolveKeepMine() {
    send(UI_TO_WORKER.RESOLVE_KEEP_MINE);
  },
  simulateServerEdit() {
    send(UI_TO_WORKER.SIMULATE_SERVER_EDIT);
  },
};
