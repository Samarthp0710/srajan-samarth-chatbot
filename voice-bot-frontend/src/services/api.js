import axios from 'axios';

// 1. Get the Backend URL from the .env file (or default to localhost)
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// 2. Create a "Messenger" instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Function A: Send Text Message
 * Payload: { "message": "Hello" }
 */
export const sendTextMessage = async (text) => {
  try {
    const response = await api.post('/chat/text', { message: text });
    return response.data; 
    // Returns: { bot_text: "...", bot_audio: "...", detected_language: "..." }
  } catch (error) {
    console.error("Text API Error:", error);
    throw error;
  }
};

/**
 * Function B: Send Voice Audio
 * Payload: FormData containing the audio file
 */
export const sendVoiceMessage = async (audioBlob) => {
  try {
    // We must use FormData to send files (matches Python's UploadFile)
    const formData = new FormData();
    // 'file' must match the parameter name in your Python voice.py
    formData.append('file', audioBlob, 'voice_input.wav'); 

    const response = await api.post('/voice/chat', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Crucial for file uploads
      },
    });
    return response.data;
    // Returns: { user_text: "...", bot_text: "...", bot_audio: "..." }
  } catch (error) {
    console.error("Voice API Error:", error);
    throw error;
  }
};

export default api;