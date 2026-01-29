export const PROTOCOL_VERSION = 1;

export const UI_TO_WORKER = {
  INIT: "engine/init",
  SET_ONLINE: "engine/setOnline",
  CONNECT: "engine/connect",
  DISCONNECT: "engine/disconnect",
  LOAD_SNAPSHOT: "engine/loadSnapshot",
  ENQUEUE_PATCH_TITLE: "engine/enqueuePatchTitle",
  SYNC_NOW: "engine/syncNow",
  RESOLVE_USE_SERVER: "engine/resolve/useServer",
  RESOLVE_KEEP_MINE: "engine/resolve/keepMine",
  SIMULATE_SERVER_EDIT: "engine/simulateServerEdit",
};

export const WORKER_TO_UI = {
  STATUS: "engine/status",
  SNAPSHOT: "engine/snapshot",
  CONFLICT: "engine/conflict",
  SERVER_TODO: "engine/serverTodo",
};

export function createMessage({ type, payload, requestId }) {
  const message = { v: PROTOCOL_VERSION, type };
  if (payload !== undefined) {
    message.payload = payload;
  }
  if (requestId) {
    message.requestId = requestId;
  }
  return message;
}

export function isValidMessage(message) {
  return (
    message &&
    message.v === PROTOCOL_VERSION &&
    typeof message.type === "string"
  );
}
