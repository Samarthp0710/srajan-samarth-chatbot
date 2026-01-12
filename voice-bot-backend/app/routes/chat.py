from fastapi import APIRouter
from pydantic import BaseModel
from app.services.generate_reply import get_gemini_response_json
from app.services.tts_service import generate_speech


router = APIRouter(prefix="/chat", tags=["Chat"])


# -----------------------
# Request / Response Models
# -----------------------

class ChatRequest(BaseModel):
    message: str


class ChatVoiceResponse(BaseModel):
    bot_text: str
    bot_audio: str
    detected_language: str


# -----------------------
# TEXT → TEXT + VOICE
# -----------------------

@router.post("/text", response_model=ChatVoiceResponse)
async def text_chat(data: ChatRequest):

    # 1. Ask Gemini to do BOTH detection and generation
    # Note: Ensure get_gemini_response_json is async!
    ai_response = await get_gemini_response_json(data.message)
    
    bot_reply = ai_response.get("reply")
    detected_language = ai_response.get("language_code", "en") # default to 'en'

    # 🔊 Convert reply to voice
    audio_path = await generate_speech(
        text=bot_reply,
        language=detected_language
    )

    return ChatVoiceResponse(
        bot_text=bot_reply,
        bot_audio=audio_path,
        detected_language=detected_language
    )
