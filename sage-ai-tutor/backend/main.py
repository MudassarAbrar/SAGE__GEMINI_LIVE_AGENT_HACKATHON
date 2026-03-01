from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uuid
import datetime
import json
import os

# Placeholder for Firestore initialization
# from google.cloud import firestore
# db = firestore.Client()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For hacking ease
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SessionStartParams(BaseModel):
    language: str
    topic: str = ""

@app.post("/session/start")
async def start_session(params: SessionStartParams):
    session_id = f"sess_{uuid.uuid4().hex[:8]}"
    start_time = datetime.datetime.utcnow().isoformat()
    
    # Placeholder: Store to Firestore
    # db.collection("sessions").document(session_id).set({
    #     "status": "active",
    #     "language": params.language,
    #     "topic_hint": params.topic,
    #     "start_time": start_time
    # })

    return {
        "session_id": session_id,
        "websocket_url": f"ws://localhost:8000/ws/{session_id}"
    }

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, WebSocket] = {}

    async def connect(self, session_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[session_id] = websocket

    def disconnect(self, session_id: str):
        if session_id in self.active_connections:
            del self.active_connections[session_id]

    async def send_personal_message(self, message: str, session_id: str):
        ws = self.active_connections.get(session_id)
        if ws:
            await ws.send_text(message)

manager = ConnectionManager()

@app.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    await manager.connect(session_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            try:
                parsed = json.loads(data)
                command_type = parsed.get("type")
                
                # Basic ping/pong test
                if command_type == "ping":
                    await manager.send_personal_message(json.dumps({
                        "type": "pong",
                        "payload": {"message": "Hello from backend!"}
                    }), session_id)
                    
            except json.JSONDecodeError:
                pass
                
    except WebSocketDisconnect:
        manager.disconnect(session_id)
        print(f"Client disconnected for session {session_id}")

# Run natively via `uvicorn main:app --reload`
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
