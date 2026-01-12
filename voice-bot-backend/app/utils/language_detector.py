from langdetect import detect

# Supported languages only
SUPPORTED_LANGUAGES = {
    "en": "English",
    "hi": "Hindi",
    "ta": "Tamil",
    "kn": "Kannada",
    "fr": "French"
}

def detect_language(text: str) -> str:
    """
    Detects language code from text.
    Returns only supported languages.
    Defaults to English if unsupported or error.
    """

    try:
        lang_code = detect(text)
        print("Detected raw language:", lang_code)

        if lang_code in SUPPORTED_LANGUAGES:
            return lang_code
        
        return "en"

    except Exception:
        return "en"
