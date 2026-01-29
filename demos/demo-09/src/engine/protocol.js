export const PROTOCOL_VERSION = 1;

export const UI_TO_WORKER = {
  INIT: "engine/init",
  LOAD: "engine/load",
  SET_ONLINE: "engine/setOnline",
  CONNECT: "engine/connect",
  DISCONNECT: "engine/disconnect",
  SET_TEXT: "engine/setText",
};

export const WORKER_TO_UI = {
  STATUS: "engine/status",
  DOC: "engine/doc",
  STATS: "engine/stats",
  EVENT: "engine/event",
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
