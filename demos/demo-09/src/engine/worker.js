import * as Y from "yjs";
import {
  UI_TO_WORKER,
  WORKER_TO_UI,
  createMessage,
  isValidMessage,
} from "./protocol";
import { openClientDb, readKey, writeKey } from "./idb";
import {
  computeTextDiff,
  encodeUpdateBase64,
  decodeUpdateBase64,
} from "./crdt";

const SERVER_URL = "ws://localhost:8081";
const SNAPSHOT_KEY = "yjsSnapshot";
const PERSIST_DELAY_MS = 500;

let clientId = "client";
let isOnline = true;
let status = "booting";
let isConnected = false;
let error = null;
let ws = null;
let handshakeComplete = false;
let db = null;

let doc = null;
let text = null;

let persistTimer = null;
let stats = {
  localTransactions: 0,
  outboundQueued: 0,
  outboundSent: 0,
  inboundReceived: 0,
  remoteApplied: 0,
  lastServerSeenAt: null,
};

function postToUI(type, payload, requestId) {
  self.postMessage(createMessage({ type, payload, requestId }));
}

function emitStatus(nextStatus, nextError = null) {
  status = nextStatus;
  error = nextError;
  postToUI(WORKER_TO_UI.STATUS, { status, isConnected, error });
}

function emitDoc() {
  postToUI(WORKER_TO_UI.DOC, { text: text.toString() });
}

function emitStats() {
  postToUI(WORKER_TO_UI.STATS, { ...stats });
}

function emitEvent(type, detail) {
  postToUI(WORKER_TO_UI.EVENT, {
    at: Date.now(),
    type,
    detail,
  });
}

function updateStats(patch) {
  stats = { ...stats, ...patch };
  emitStats();
}

function schedulePersist() {
  if (!db) return;
  if (persistTimer) {
    clearTimeout(persistTimer);
  }
  persistTimer = setTimeout(async () => {
    persistTimer = null;
    const snapshot = Y.encodeStateAsUpdate(doc);
    await writeKey(db, SNAPSHOT_KEY, snapshot);
    emitEvent("PERSIST");
  }, PERSIST_DELAY_MS);
}

function recordInbound(detail) {
  updateStats({
    inboundReceived: stats.inboundReceived + 1,
    lastServerSeenAt: Date.now(),
  });
  emitEvent("RECV_UPDATE", detail);
}

function recordOutbound(detail) {
  updateStats({
    outboundSent: stats.outboundSent + 1,
  });
  emitEvent("SEND_UPDATE", detail);
}

function recordQueue() {
  updateStats({
    outboundQueued: stats.outboundQueued + 1,
  });
  emitEvent("QUEUE_OUTBOUND");
}

function recordRemoteApplied(detail) {
  updateStats({
    remoteApplied: stats.remoteApplied + 1,
  });
  emitEvent("APPLY_REMOTE", detail);
}

function setupDoc() {
  doc = new Y.Doc();
  text = doc.getText("title");

  doc.on("update", (update, origin) => {
    if (origin === "local") {
      if (handshakeComplete && ws && ws.readyState === WebSocket.OPEN) {
        const updateB64 = encodeUpdateBase64(update);
        ws.send(JSON.stringify({ type: "update", updateB64 }));
        recordOutbound("steady-state");
      } else {
        recordQueue();
      }
      schedulePersist();
      return;
    }

    if (origin === "remote" || origin === "remote-handshake") {
      recordRemoteApplied(
        origin === "remote-handshake" ? "handshake" : "steady-state"
      );
      schedulePersist();
      return;
    }
  });
}

function resetConnectionState() {
  isConnected = false;
  handshakeComplete = false;
}

function closeSocket() {
  if (!ws) return;
  ws.onopen = null;
  ws.onmessage = null;
  ws.onclose = null;
  ws.onerror = null;
  try {
    if (
      ws.readyState === WebSocket.OPEN ||
      ws.readyState === WebSocket.CONNECTING
    ) {
      ws.close();
    }
  } catch (closeError) {
  }
  ws = null;
  resetConnectionState();
}

function handleSocketMessage(event) {
  let message;
  try {
    message = JSON.parse(event.data);
  } catch (parseError) {
    return;
  }

  if (message.type === "welcome") {
    const update = decodeUpdateBase64(message.updateB64);
    const serverSv = decodeUpdateBase64(message.svB64);
    recordInbound("handshake");
    Y.applyUpdate(doc, update, "remote-handshake");
    emitDoc();

    const clientUpdate = Y.encodeStateAsUpdate(doc, serverSv);
    ws.send(
      JSON.stringify({
        type: "clientUpdate",
        updateB64: encodeUpdateBase64(clientUpdate),
      })
    );
    recordOutbound("handshake");

    updateStats({ outboundQueued: 0 });
    isConnected = true;
    handshakeComplete = true;
    emitStatus("connected");
    emitEvent("CONNECT");
    return;
  }

  if (message.type === "update") {
    recordInbound("steady-state");
    const update = decodeUpdateBase64(message.updateB64);
    Y.applyUpdate(doc, update, "remote");
    emitDoc();
    return;
  }
}

async function handleInit(payload) {
  clientId = payload?.clientId ?? "client";
  setupDoc();
  db = await openClientDb(clientId);
  emitStatus("booting");
  emitEvent("BOOT");
}

async function handleLoad() {
  if (!db) return;
  const snapshot = await readKey(db, SNAPSHOT_KEY);
  if (snapshot) {
    const update = snapshot instanceof Uint8Array ? snapshot : new Uint8Array(snapshot);
    Y.applyUpdate(doc, update, "load");
  }
  emitDoc();
  emitEvent("LOAD");
  emitStats();
  emitStatus(isOnline ? "idle" : "offline");
}

function handleSetOnline(payload) {
  isOnline = Boolean(payload?.isOnline);
  if (!isOnline) {
    closeSocket();
    emitStatus("offline");
    emitEvent("DISCONNECT");
    return;
  }
  emitStatus("idle");
}

function handleConnect() {
  if (!isOnline) {
    emitStatus("error", "Offline. Go online to connect.");
    emitEvent("ERROR", "Offline. Go online to connect.");
    return;
  }
  if (ws) {
    if (ws.readyState !== WebSocket.CLOSED) {
      return;
    }
    closeSocket();
  }

  emitStatus("connecting");
  ws = new WebSocket(SERVER_URL);

  ws.onopen = () => {
    const svB64 = encodeUpdateBase64(Y.encodeStateVector(doc));
    ws.send(JSON.stringify({ type: "hello", clientId, svB64 }));
  };

  ws.onmessage = handleSocketMessage;

  ws.onclose = () => {
    closeSocket();
    emitStatus(isOnline ? "idle" : "offline");
    emitEvent("DISCONNECT");
  };

  ws.onerror = () => {
    closeSocket();
    emitStatus("error", "WebSocket error.");
    emitEvent("ERROR", "WebSocket error.");
  };
}

function handleDisconnect() {
  closeSocket();
  emitStatus(isOnline ? "idle" : "offline");
  emitEvent("DISCONNECT");
}

function handleSetText(payload) {
  const nextText = payload?.nextText ?? "";
  const current = text.toString();
  if (nextText === current) {
    return;
  }

  const diff = computeTextDiff(current, nextText);
  doc.transact(() => {
    if (diff.deleteCount > 0) {
      text.delete(diff.index, diff.deleteCount);
    }
    if (diff.insertText) {
      text.insert(diff.index, diff.insertText);
    }
  }, "local");

  updateStats({ localTransactions: stats.localTransactions + 1 });
  emitEvent("LOCAL_TX");
  emitDoc();
}

let messageQueue = Promise.resolve();

function enqueueTask(task) {
  messageQueue = messageQueue
    .then(task)
    .catch((err) => {
      emitStatus("error", err?.message ?? "Worker error.");
      emitEvent("ERROR", err?.message ?? "Worker error.");
    });
  return messageQueue;
}

self.onmessage = (event) => {
  enqueueTask(() => {
    const message = event.data;
    if (!isValidMessage(message)) return;

    switch (message.type) {
      case UI_TO_WORKER.INIT:
        return handleInit(message.payload);
      case UI_TO_WORKER.LOAD:
        return handleLoad();
      case UI_TO_WORKER.SET_ONLINE:
        return handleSetOnline(message.payload);
      case UI_TO_WORKER.CONNECT:
        return handleConnect();
      case UI_TO_WORKER.DISCONNECT:
        return handleDisconnect();
      case UI_TO_WORKER.SET_TEXT:
        return handleSetText(message.payload);
      default:
        return;
    }
  });
};
