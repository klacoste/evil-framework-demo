import {
  UI_TO_WORKER,
  WORKER_TO_UI,
  createMessage,
  isValidMessage,
} from "../engine/protocol";
import { EngineDomain } from "../domains/engineDomain";
import { DocDomain } from "../domains/docDomain";
import { StatsDomain } from "../domains/statsDomain";
import { EventLogDomain } from "../domains/eventLogDomain";

let worker = null;

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
        EngineDomain.commands.setStatus(payload ?? {});
        return;
      case WORKER_TO_UI.DOC:
        if (typeof payload?.text === "string") {
          DocDomain.commands.setText(payload.text);
        }
        return;
      case WORKER_TO_UI.STATS:
        if (payload) {
          StatsDomain.commands.setStats(payload);
        }
        return;
      case WORKER_TO_UI.EVENT:
        if (payload) {
          EventLogDomain.commands.append(payload);
        }
        return;
      default:
        return;
    }
  });
  return worker;
}

function send(type, payload, { requestId } = {}) {
  const targetWorker = ensureWorker();
  targetWorker.postMessage(createMessage({ type, payload, requestId }));
}

export const EngineService = {
  start() {
    ensureWorker();
  },
  init(clientId) {
    send(UI_TO_WORKER.INIT, { clientId });
  },
  load() {
    send(UI_TO_WORKER.LOAD);
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
  setText(nextText) {
    send(UI_TO_WORKER.SET_TEXT, { nextText });
  },
};
