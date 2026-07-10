# server.py — a minimal WebSocket broadcast server in Python (websockets library).
import asyncio
from websockets.asyncio.server import serve

clients = set()

async def handler(socket):
    clients.add(socket)
    try:
        async for message in socket:
            # fan the message out to everyone except the sender
            for client in clients:
                if client is not socket:
                    await client.send(message)
    finally:
        clients.discard(socket)

async def main():
    async with serve(handler, "localhost", 8080):
        print("WebSocket server listening on ws://localhost:8080")
        await asyncio.get_running_loop().create_future()  # run forever

asyncio.run(main())
