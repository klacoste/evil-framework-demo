import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

let serverTodo = { id: "t1", title: "Buy milk", version: 1 };
const appliedOps = new Set();

function send(ws, message) {
  ws.send(JSON.stringify(message));
}

function broadcast(message) {
  const data = JSON.stringify(message);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

function applyServerEdit() {
  serverTodo = {
    ...serverTodo,
    title: `${serverTodo.title} (server edit)`,
    version: serverTodo.version + 1,
  };
  broadcast({ type: "serverTodo", todo: serverTodo });
}

wss.on("connection", (ws) => {
  send(ws, { type: "serverTodo", todo: serverTodo });

  ws.on("message", (raw) => {
    let data;
    try {
      data = JSON.parse(raw.toString());
    } catch (parseError) {
      return;
    }

    if (data.type === "simulateServerEdit") {
      applyServerEdit();
      return;
    }

    if (data.type === "pushOps") {
      const ops = Array.isArray(data.ops) ? data.ops : [];
      const op = ops[0];
      if (!op) {
        send(ws, { type: "pushResult", todo: serverTodo });
        return;
      }

      if (appliedOps.has(op.opId)) {
        send(ws, { type: "pushResult", todo: serverTodo });
        return;
      }

      if (op.baseVersion !== serverTodo.version) {
        send(ws, {
          type: "conflict",
          conflict: { opId: op.opId, serverTodo },
        });
        return;
      }

      serverTodo = {
        ...serverTodo,
        title: op.patch.title,
        version: serverTodo.version + 1,
      };
      appliedOps.add(op.opId);
      send(ws, { type: "pushResult", todo: serverTodo });
      broadcast({ type: "serverTodo", todo: serverTodo });
    }
  });
});

console.log("Demo 08 server listening on ws://localhost:8080");
