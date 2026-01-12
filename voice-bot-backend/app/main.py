from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware  # 👈 IMPORT THIS
from app.routes.chat import router as chat_router
from app.routes.voice import router as voice_router
import os

app = FastAPI(title="Voice Bot Backend")

# ----------------------------------------------------
# 🔓 ALLOW FRONTEND CONNECTION (CORS)
# ----------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows ALL frontends (safest for development)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (POST, GET, etc.)
    allow_headers=["*"],
)
# ----------------------------------------------------

# Mount the folder where TTS saves audio so frontend can play it
os.makedirs("bot_audio", exist_ok=True)
app.mount("/bot_audio", StaticFiles(directory="bot_audio"), name="bot_audio")

app.include_router(chat_router)
app.include_router(voice_router)

@app.get("/health")
def health_check():
    return {"status": "Backend is running"}