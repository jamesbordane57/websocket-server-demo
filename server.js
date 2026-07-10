// server.js — the smallest useful WebSocket server: relay every message to all other clients.
import { WebSocketServer, WebSocket } from "ws";

const PORT = process.env.PORT || 8080;
const wss = new WebSocketServer({ port: PORT });

wss.on("connection", (socket) => {
  console.log("client connected — total:", wss.clients.size);

  socket.on("message", (data, isBinary) => {
    // fan the message out to everyone except the sender
    for (const client of wss.clients) {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    }
  });

  socket.on("close", () => {
    console.log("client disconnected — total:", wss.clients.size);
  });
});

console.log(`WebSocket server listening on ws://localhost:${PORT}`);
