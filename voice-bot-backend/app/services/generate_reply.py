import os
import json
import random
import asyncio
from functools import partial
from google import genai
from dotenv import load_dotenv

load_dotenv()

# --- CONFIGURATION ---
USE_MOCK_MODE = False  # Set to True for testing without using quota

# Setup the Client
# We get the key just like in your original file
api_key = os.getenv("GEMINI_API_KEY", "").strip().strip('"')
client = genai.Client(api_key=api_key)

# ... imports remain the same ...

async def get_gemini_response_json(user_message: str, language_hint: str = None):
    """
    Args:
        user_message: The text to reply to.
        language_hint: (Optional) The language code if we already know it (e.g., from Whisper).
    """

    # --- 1. MOCK MODE ---
    if USE_MOCK_MODE:
        await asyncio.sleep(1)
        return {
            "reply": f"[MOCK] Received: '{user_message}'",
            "language_code": language_hint if language_hint else "en"
        }

    # --- 2. REAL AI LOGIC ---
    
    # Dynamic Prompt Construction
    if language_hint:
        # SCENARIO A: We know the language (Voice Flow)
        task_instruction = f"""
        1. The user is speaking in language code: '{language_hint}'.
        2. Generate a helpful, concise response strictly in '{language_hint}' (Native Script).
        3. Return the result strictly as a Valid JSON object.
        """
    else:
        # SCENARIO B: We don't know the language (Text Flow)
        task_instruction = """
        1. Detect the language of the user input.
        2. Generate a helpful, concise response in the SAME language and SAME script.
        3. Return the result strictly as a Valid JSON object.
        """

    prompt = f"""
    You are a multilingual AI assistant.
    User Input: "{user_message}"

    Task:
    {task_instruction}

    Output Schema:
    {{
        "reply": "The response text in native script",
        "language_code": "The 2-letter ISO code (e.g., 'en', 'kn', 'ta', 'hi')"
    }}
    """

    try:
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None,
            lambda: client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config={"response_mime_type": "application/json"}
            )
        )
        
        return json.loads(response.text)

    except Exception as e:
        print(f"Gemini API Error: {e}")
        return {"reply": "Technical error.", "language_code": "en"}