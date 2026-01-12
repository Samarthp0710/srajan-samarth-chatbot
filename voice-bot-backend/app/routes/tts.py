from fastapi import APIRouter
from app.services.tts_service import generate_speech

router = APIRouter(prefix="/tts", tags=["TTS"])

@router.post("/speak")
async def speak(text: str, language: str = "en"):
    audio_path = await generate_speech(text, language)
    return {
        "audio_file": audio_path
    }
