import edge_tts
import uuid
import os

AUDIO_OUTPUT_FOLDER = "bot_audio"
os.makedirs(AUDIO_OUTPUT_FOLDER, exist_ok=True)

# Map language → voice
VOICE_MAP = {
    "en": "en-US-GuyNeural",
    "hi": "hi-IN-MadhurNeural",
    "ta": "ta-IN-ValluvarNeural",
    "kn": "kn-IN-GaganNeural",
    "te": "te-IN-MohanNeural", 
    "mr": "mr-IN-ManoharNeural", 
    "ml": "ml-IN-MidhunNeural",  
    "gu": "gu-IN-NiranjanNeural"
}

DEFAULT_VOICE = "en-US-GuyNeural"

async def generate_speech(text: str, language: str = "en") -> str:
    """
    Converts text to speech using edge-tts.
    Saves audio file and returns file path.
    """

    filename = f"{uuid.uuid4()}.mp3"
    file_path = os.path.join(AUDIO_OUTPUT_FOLDER, filename)

    voice = VOICE_MAP.get(language, DEFAULT_VOICE)

    communicator = edge_tts.Communicate(text, voice)
    await communicator.save(file_path)

    return file_path
