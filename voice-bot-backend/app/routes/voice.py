from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.speech_service import transcribe_audio
from app.services.generate_reply import get_gemini_response_json
from app.services.tts_service import generate_speech

import os
import uuid

router = APIRouter(prefix="/voice", tags=["Voice"])

UPLOAD_FOLDER = "temp_audio"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/chat")
async def voice_chat(file: UploadFile = File(...)):

    allowed_types = [
        "audio/wav",
        "audio/mpeg",
        "audio/mp3",
        "audio/webm",
        "audio/mp4",
        "audio/x-m4a"
    ]

    # ✅ Validate file type
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Only audio files are allowed"
        )

    # ✅ Save uploaded file
    extension = file.filename.split(".")[-1]
    unique_name = f"{uuid.uuid4()}.{extension}"
    file_path = os.path.join(UPLOAD_FOLDER, unique_name)

    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)

    # ✅ Speech → Text
    transcription = await transcribe_audio(file_path)

    if "error" in transcription:
        raise HTTPException(
            status_code=400,
            detail=transcription["error"]
        )

    user_text = transcription["text"]

    # ✅ (Optional) Language hint – for now auto / English
    detected_language = transcription["language"]

    # ✅ Text → Gemini AI
    ai_response = await get_gemini_response_json(
        user_message=user_text,
        language_hint=detected_language
    )

    bot_reply_text = ai_response.get("reply")
    # ✅ Text → Speech

    print(f"DEBUG: User said: '{user_text}'")
    print(f"DEBUG: Detected Language: '{detected_language}'")
    print(f"DEBUG: Bot Reply to TTS: '{bot_reply_text}'")

    audio_path = await generate_speech(
        text=bot_reply_text,
        language=detected_language
    )

    return {
        "bot_text": bot_reply_text,
        "bot_audio": audio_path,
        "language" : detected_language
    }
