import whisper
import asyncio
from functools import partial

# 1. Load the model once (Global variable)
# "base" is a good balance. If it's too slow, try "tiny".
print("Loading Whisper model...")
model = whisper.load_model("base")
print("Whisper model loaded successfully!")

# 2. Define the Async Function
async def transcribe_audio(file_path: str):
    """
    Runs the blocking Whisper transcription in a separate thread 
    so it doesn't freeze the FastAPI server.
    """
    loop = asyncio.get_event_loop()
    
    # Run the heavy 'model.transcribe' function in a thread executor
    try:
        result = await loop.run_in_executor(
            None, 
            partial(model.transcribe, file_path)
        )
        
        return {
            "text": result["text"],
            "language": result["language"]
        }
    except Exception as e:
        print(f"Error during transcription: {e}")
        return {"text": "", "language": "unknown"}