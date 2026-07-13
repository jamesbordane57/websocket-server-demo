# Minimal WebSocket server (Node.js + ws)

Companion code for the tutorial **"WebSocket Server: How to Build One in Node.js — and When to Use a Managed One."**

📖 **Full tutorial:** &lt;article-url-pending&gt;

Servers, from simplest to slightly-less-simple:

- **`server.js`** — the smallest useful server: relays every message to all other connected clients.
- **`rooms-server.js`** — adds rooms (channels), presence (`peer-joined` / `peer-left`), a small JSON protocol, and a ping/pong heartbeat that reclaims dead connections.
- **`server.py`** — the same broadcast server in Python (`websockets` library), to show the pattern is language-agnostic.

Plus **`index.html`** — a tiny browser chat client that talks to `rooms-server.js`.

## Run it

```bash
npm install

# broadcast server:
npm start
# …or the rooms + presence + heartbeat server:
npm run rooms
```

Or the same broadcast server in Python:

```bash
pip install websockets
python server.py
```

Then open `index.html` in two browser tabs (from `file://` is fine, or `npm run serve`). Type in one tab; the other receives it. Open a third tab to watch presence events.

## Run the managed twin (no server)

**`metered-chat.html`** is the same chat app as a client of [Metered Realtime Messaging](https://www.metered.ca/docs/realtime-messaging/) — there is no server file at all.

1. Get a free publishable key (no card) from the link above.
2. Replace `pk_live_YOUR_KEY` in `metered-chat.html` with your key.
3. Serve the folder (`npm run serve` or any static server) and open the page in two tabs.

## The JSON protocol (rooms-server.js)

Client → server: `{ "type": "join", "room": "lobby" }`, `{ "type": "message", "data": "…" }`
Server → client: `{ "type": "joined", "room": "…" }`, `{ "type": "presence", "event": "peer-joined" | "peer-left" }`, `{ "type": "message", "data": "…" }`

## License

MIT — see [LICENSE](./LICENSE).
