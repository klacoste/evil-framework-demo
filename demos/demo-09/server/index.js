import { WebSocketServer, WebSocket } from "ws";
import * as Y from "yjs";

const wss = new WebSocketServer({ port: 8081 });
const serverDoc = new Y.Doc();

function encodeUpdateBase64(update) {
  return Buffer.from(update).toString("base64");
}

function decodeUpdateBase64(updateB64) {
  return new Uint8Array(Buffer.from(updateB64, "base64"));
}

function broadcast(sender, message) {
  const data = JSON.stringify(message);
  wss.clients.forEach((client) => {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

wss.on("connection", (ws) => {
  ws.clientId = null;

  ws.on("message", (raw) => {
    let data;
    try {
      data = JSON.parse(raw.toString());
    } catch (parseError) {
      return;
    }

    if (data.type === "hello") {
      ws.clientId = data.clientId;
      const clientSv = decodeUpdateBase64(data.svB64);
      const serverSv = Y.encodeStateVector(serverDoc);
      const updateB64 = encodeUpdateBase64(
        Y.encodeStateAsUpdate(serverDoc, clientSv)
      );

      ws.send(
        JSON.stringify({
          type: "welcome",
          svB64: encodeUpdateBase64(serverSv),
          updateB64,
        })
      );
      return;
    }

    if (data.type === "clientUpdate") {
      const update = decodeUpdateBase64(data.updateB64);
      Y.applyUpdate(serverDoc, update, "client");
      broadcast(ws, {
        type: "update",
        updateB64: data.updateB64,
        from: ws.clientId,
      });
      return;
    }

    if (data.type === "update") {
      const update = decodeUpdateBase64(data.updateB64);
      Y.applyUpdate(serverDoc, update, "client");
      broadcast(ws, {
        type: "update",
        updateB64: data.updateB64,
        from: ws.clientId,
      });
      return;
    }
  });
});

console.log("Demo 09 server listening on ws://localhost:8081");
