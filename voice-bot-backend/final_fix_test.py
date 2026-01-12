import os
from google import genai

# Explicitly grab ONLY the key you want
api_key = os.getenv("GEMINI_API_KEY", "").strip().strip('"')

print(f"Using Key: {api_key[:8]}...")

# Initialize client without relying on auto-discovery
client = genai.Client(api_key=api_key)

try:
    print("Connecting to Gemini 2.5 Flash...")
    # Use the 2.5 version which is standard for early 2026
    response = client.models.generate_content(
        model="gemini-2.5-flash", 
        contents="Confirm connection."
    )
    print("SUCCESS! Response:", response.text)
except Exception as e:
    print(f"FAILED: {e}")