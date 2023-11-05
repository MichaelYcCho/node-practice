import asyncio
import websockets


async def echo(websocket, path):
    print("Client connected")
    try:
        async for message in websocket:
            print(f"Received message from client: {message}")
            await websocket.send(f"Server received your message: {message}")
    except websockets.ConnectionClosed as e:
        print("Client disconnected", e)

start_server = websockets.serve(echo, "localhost", 8765)


print("Starting server...")
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()