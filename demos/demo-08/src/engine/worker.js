import {
  UI_TO_WORKER,
  WORKER_TO_UI,
  createMessage,
  isValidMessage,
} from "./protocol";
import { openClientDb, readKey, writeKey } from "./idb";

const DEFAULT_TODO = { id: "t1", title: "Buy milk", version: 1 };
const SERVER_URL = "ws://localhost:8080";
const AUTO_SYNC_DELAY_MS = 400;

let db = null;
let clientId = null;
let todo = DEFAULT_TODO;
let outbox = [];
let isOnline = true;
let isConnected = false;
let status = "booting";
let error = null;
let ws = null;
let activeConflict = null;
let opCounter = 0;
let pendingPush = null;
let autoSyncTimer = null;

function postToUI(type, payload, requestId) {
  self.postMessage(createMessage({ type, payload, requestId }));
}

function emitStatus(nextStatus, nextError = null) {
  status = nextStatus;
  error = nextError;
  postToUI(WORKER_TO_UI.STATUS, { status, isConnected, error });
}

function emitSnapshot(requestId) {
  postToUI(WORKER_TO_UI.SNAPSHOT, { todo, outbox }, requestId);
}

function emitConflict(conflict) {
  activeConflict = conflict;
  postToUI(WORKER_TO_UI.CONFLICT, { conflict });
}

function emitServerTodo(nextTodo) {
  postToUI(WORKER_TO_UI.SERVER_TODO, { todo: nextTodo });
}

function disposeSocket({ emit } = { emit: false }) {
  if (autoSyncTimer) {
    clearTimeout(autoSyncTimer);
    autoSyncTimer = null;
  }
  if (pendingPush) {
    pendingPush.reject(
      new Error("Disconnected. Click Connect to sync.")
    );
    pendingPush = null;
  }
  if (!ws) return;
  ws.onopen = null;
  ws.onmessage = null;
  ws.onclose = null;
  ws.onerror = null;
  try {
    ws.close();
  } catch (closeError) {
  }
  ws = null;
  isConnected = false;
  if (emit) {
    emitStatus(isOnline ? "idle" : "offline");
  }
}

function coalesceOutbox(nextOp) {
  const lastOp = outbox[outbox.length - 1];
  if (
    lastOp &&
    lastOp.type === "patchTitle" &&
    lastOp.todoId === nextOp.todoId
  ) {
    outbox = outbox.slice(0, -1).concat(nextOp);
    return;
  }
  outbox = outbox.concat(nextOp);
}

function applyLocalPatch(op) {
  if (op.type === "patchTitle") {
    todo = { ...todo, title: op.patch.title };
  }
}

async function persistSnapshot() {
  if (!db) return;
  await writeKey(db, "outbox", outbox);
  await writeKey(db, "todo", todo);
}

function nextOpId() {
  opCounter += 1;
  return `op_${clientId ?? "client"}_${Date.now()}_${opCounter}`;
}

async function handleSocketMessage(event) {
  const data = event;
  if (data.type !== "serverTodo") return;

  emitServerTodo(data.todo);
  if (!outbox.length && !activeConflict) {
    todo = data.todo;
    await persistSnapshot();
    emitSnapshot();
    emitStatus(isOnline ? "idle" : "offline");
  }
}

function sendPushOp(op) {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    return Promise.reject(new Error("Disconnected. Click Connect to sync."));
  }

  if (pendingPush) {
    return Promise.reject(new Error("Sync already in progress."));
  }

  return new Promise((resolve, reject) => {
    pendingPush = { resolve, reject };
    ws.send(JSON.stringify({ type: "pushOps", ops: [op] }));
  });
}

async function handleInit(payload) {
  clientId = payload?.clientId ?? "client";
  db = await openClientDb(clientId);
  emitStatus("booting");
}

async function handleLoadSnapshot(requestId) {
  if (!db) return;
  const persistedTodo = await readKey(db, "todo");
  const persistedOutbox = await readKey(db, "outbox");
  todo = persistedTodo ?? { ...DEFAULT_TODO };
  outbox = persistedOutbox ?? [];
  emitSnapshot(requestId);
  emitStatus(isOnline ? "idle" : "offline");
}

function handleSetOnline(payload) {
  isOnline = Boolean(payload?.isOnline);
  if (!isOnline) {
    disposeSocket({ emit: false });
    emitStatus("offline");
    return;
  }
  emitStatus("idle");
}

function handleConnect() {
  if (!isOnline) {
    emitStatus("error", "Offline. Go online to connect.");
    return;
  }

  if (ws && isConnected) {
    emitStatus("idle");
    return;
  }

  emitStatus("connecting");
  ws = new WebSocket(SERVER_URL);

  ws.onopen = () => {
    isConnected = true;
    emitStatus("idle");
    scheduleAutoSync(0);
  };

  ws.onclose = () => {
    isConnected = false;
    if (autoSyncTimer) {
      clearTimeout(autoSyncTimer);
      autoSyncTimer = null;
    }
    if (pendingPush) {
      pendingPush.reject(
        new Error("Disconnected. Click Connect to sync.")
      );
      pendingPush = null;
    }
    emitStatus(isOnline ? "idle" : "offline");
  };

  ws.onerror = () => {
    isConnected = false;
    if (pendingPush) {
      pendingPush.reject(new Error("WebSocket error."));
      pendingPush = null;
    }
    emitStatus("error", "WebSocket error.");
  };

  ws.onmessage = (event) => {
    let data;
    try {
      data = JSON.parse(event.data);
    } catch (parseError) {
      return;
    }

    if (data.type === "pushResult" && pendingPush) {
      const { resolve } = pendingPush;
      pendingPush = null;
      resolve({ ok: true, todo: data.todo });
      return;
    }

    if (data.type === "conflict" && pendingPush) {
      const { resolve } = pendingPush;
      pendingPush = null;
      resolve({ ok: false, conflict: data.conflict });
      return;
    }

    enqueueTask(() => handleSocketMessage(data));
  };
}

function handleDisconnect() {
  disposeSocket({ emit: true });
}

async function handleEnqueuePatchTitle(payload) {
  if (!payload) return;
  const op = {
    opId: payload.opId,
    type: "patchTitle",
    todoId: "t1",
    patch: { title: payload.title },
    baseVersion: payload.baseVersion,
    createdAt: payload.createdAt,
  };
  applyLocalPatch(op);
  coalesceOutbox(op);
  await persistSnapshot();
  emitSnapshot();
  scheduleAutoSync();
}

function scheduleAutoSync(delay = AUTO_SYNC_DELAY_MS) {
  if (!isOnline) {
    emitStatus("offline");
    return;
  }
  if (!isConnected) {
    return;
  }
  if (activeConflict) {
    emitStatus("conflict");
    return;
  }
  if (!outbox.length) {
    emitStatus("idle");
    return;
  }
  if (autoSyncTimer) {
    clearTimeout(autoSyncTimer);
  }
  autoSyncTimer = setTimeout(() => {
    autoSyncTimer = null;
    enqueueTask(() => performSync({ manual: false }));
  }, delay);
}

async function performSync({ manual }) {
  if (status === "syncing") return;
  if (!isOnline) {
    if (manual) {
      emitStatus("error", "Offline. Go online to sync.");
      return;
    }
    emitStatus("offline");
    return;
  }
  if (!isConnected) {
    if (manual) {
      emitStatus("error", "Disconnected. Click Connect to sync.");
    }
    return;
  }
  if (!outbox.length) {
    emitStatus("idle");
    return;
  }
  if (activeConflict) {
    emitStatus("conflict");
    return;
  }

  emitStatus("syncing");

  const op = outbox[0];
  let response;
  try {
    response = await sendPushOp(op);
  } catch (sendError) {
    emitStatus("error", sendError.message);
    return;
  }

  if (response.ok) {
    todo = response.todo;
    outbox = outbox.filter((entry) => entry.opId !== op.opId);
    await persistSnapshot();
    emitSnapshot();
    emitServerTodo(response.todo);
    emitConflict(null);
    emitStatus("idle");
    return;
  }

  emitConflict({
    opId: response.conflict.opId,
    baseVersion: op.baseVersion,
    minePatch: op.patch,
    serverTodo: response.conflict.serverTodo,
  });
  emitStatus("conflict");
}

async function handleSyncNow() {
  if (autoSyncTimer) {
    clearTimeout(autoSyncTimer);
    autoSyncTimer = null;
  }
  await performSync({ manual: true });
}

async function handleUseServer() {
  if (!activeConflict) return;
  todo = activeConflict.serverTodo;
  outbox = outbox.filter((entry) => entry.opId !== activeConflict.opId);
  await persistSnapshot();
  emitSnapshot();
  emitConflict(null);
  emitServerTodo(todo);
  emitStatus(isOnline ? "idle" : "offline");
}

async function handleKeepMine() {
  if (!activeConflict) return;
  const { minePatch, serverTodo: serverState } = activeConflict;
  outbox = outbox.filter((entry) => entry.opId !== activeConflict.opId);
  const rebasedOp = {
    opId: nextOpId(),
    type: "patchTitle",
    todoId: "t1",
    patch: minePatch,
    baseVersion: serverState.version,
    createdAt: Date.now(),
  };
  coalesceOutbox(rebasedOp);
  await persistSnapshot();
  emitSnapshot();
  emitConflict(null);
  await performSync({ manual: false });
}

function handleSimulateServerEdit() {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    emitStatus("error", "Disconnected. Click Connect to simulate edit.");
    return;
  }
  ws.send(JSON.stringify({ type: "simulateServerEdit" }));
}

let messageQueue = Promise.resolve();

function enqueueTask(task) {
  messageQueue = messageQueue
    .then(task)
    .catch((error) => {
      emitStatus("error", error?.message ?? "Worker error.");
    });
  return messageQueue;
}

async function handleMessage(event) {
  const message = event.data;
  if (!isValidMessage(message)) return;

  switch (message.type) {
    case UI_TO_WORKER.INIT:
      await handleInit(message.payload);
      return;
    case UI_TO_WORKER.SET_ONLINE:
      handleSetOnline(message.payload);
      return;
    case UI_TO_WORKER.CONNECT:
      handleConnect();
      return;
    case UI_TO_WORKER.DISCONNECT:
      handleDisconnect();
      return;
    case UI_TO_WORKER.LOAD_SNAPSHOT:
      await handleLoadSnapshot(message.requestId);
      return;
    case UI_TO_WORKER.ENQUEUE_PATCH_TITLE:
      await handleEnqueuePatchTitle(message.payload);
      return;
    case UI_TO_WORKER.SYNC_NOW:
      await handleSyncNow();
      return;
    case UI_TO_WORKER.RESOLVE_USE_SERVER:
      await handleUseServer();
      return;
    case UI_TO_WORKER.RESOLVE_KEEP_MINE:
      await handleKeepMine();
      return;
    case UI_TO_WORKER.SIMULATE_SERVER_EDIT:
      handleSimulateServerEdit();
      return;
    default:
      return;
  }
}

self.onmessage = (event) => {
  enqueueTask(() => handleMessage(event));
};
