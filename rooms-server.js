// rooms-server.js — a WebSocket server with rooms (channels), presence, a JSON protocol, and heartbeat.
import { WebSocketServer, WebSocket } from "ws";

const PORT = process.env.PORT || 8080;
const wss = new WebSocketServer({ port: PORT });

// which room each socket is in
const roomOf = new Map();

function broadcast(room, message, except) {
  const payload = JSON.stringify(message);
  for (const client of wss.clients) {
    if (client !== except && client.readyState === WebSocket.OPEN && roomOf.get(client) === room) {
      client.send(payload);
    }
  }
}

wss.on("connection", (socket) => {
  socket.isAlive = true;
  socket.on("pong", () => { socket.isAlive = true; });

  socket.on("message", (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw);
    } catch {
      return socket.send(JSON.stringify({ type: "error", error: "invalid_json" }));
    }

    if (msg.type === "join") {
      roomOf.set(socket, msg.room);
      socket.send(JSON.stringify({ type: "joined", room: msg.room }));
      broadcast(msg.room, { type: "presence", event: "peer-joined" }, socket);
    } else if (msg.type === "message") {
      const room = roomOf.get(socket);
      if (room) broadcast(room, { type: "message", data: msg.data }, socket);
    }
  });

  socket.on("close", () => {
    const room = roomOf.get(socket);
    if (room) broadcast(room, { type: "presence", event: "peer-left" }, socket);
    roomOf.delete(socket);
  });
});

// heartbeat: every 30s, drop any socket that didn't answer the previous ping
const heartbeat = setInterval(() => {
  for (const socket of wss.clients) {
    if (socket.isAlive === false) {
      socket.terminate();
      continue;
    }
    socket.isAlive = false;
    socket.ping();
  }
}, 30000);
wss.on("close", () => clearInterval(heartbeat));

console.log(`WebSocket rooms server listening on ws://localhost:${PORT}`);
