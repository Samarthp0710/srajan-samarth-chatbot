import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid'; 
import { FaCircle, FaArrowUp } from "react-icons/fa"; // Removed FaRobot

import ChatBubble from "./components/ChatBubble";
import VoiceRecorder from "./components/VoiceRecorder";
import { sendTextMessage, sendVoiceMessage } from "./services/api";
import "./styles/App.css"; 

// IMPORT YOUR LOGO HERE
// Make sure you have a folder "src/assets" and your file is named "logo.png"
import myLogo from "./assets/logo.png"; 

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function App() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hello! I am Jarvis. Your digital sidekick 😉!",
      audioUrl: null,
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInput = (e) => {
    const target = e.target;
    setInputText(target.value);
    target.style.height = 'auto';
    target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
  };

  const handleKeyDown = (e) => {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTextSubmit(e);
    }
  };

  const addMessage = (sender, text, audioPath = null) => {
    const fullAudioUrl = audioPath ? `${BACKEND_URL}/${audioPath}` : null;
    setMessages((prev) => [
      ...prev,
      { id: uuidv4(), sender, text, audioUrl: fullAudioUrl },
    ]);
  };

  const handleTextSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    
    const text = inputText;
    setInputText(""); 
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    addMessage("user", text);
    setIsLoading(true);

    try {
      const data = await sendTextMessage(text);
      addMessage("bot", data.bot_text, data.bot_audio);
    } catch (error) {
      addMessage("bot", "Error connecting to server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceUpload = async (audioBlob) => {
    // 1. Generate ID for the temporary placeholder
    const tempMessageId = uuidv4();

    // 2. Add placeholder message
    setMessages((prev) => [
      ...prev,
      { 
        id: tempMessageId, 
        sender: "user", 
        text: "Processing audio...", 
        audioUrl: null 
      },
    ]);

    setIsLoading(true);

    try {
      const data = await sendVoiceMessage(audioBlob);

      // 3. UPDATE placeholder with real text from backend
      setMessages((prev) => 
        prev.map((msg) => 
          msg.id === tempMessageId 
            ? { ...msg, text: data.user_text } 
            : msg
        )
      );

      // 4. Add Bot Response
      addMessage("bot", data.bot_text, data.bot_audio);

    } catch (error) {
      console.error(error);
      // Handle error state
      setMessages((prev) => 
        prev.map((msg) => 
          msg.id === tempMessageId 
            ? { ...msg, text: "⚠️ Error processing audio" } 
            : msg
        )
      );
      addMessage("bot", "Error processing voice.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* HEADER */}
      <header className="chat-header">
        <div className="header-content">
            <div className="logo-box">
                {/* REPLACED FaRobot WITH IMG */}
                <img 
                    src={myLogo} 
                    alt="VoiceBot Logo" 
                    style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '50%', 
                        objectFit: 'cover' 
                    }} 
                />
            </div>
            <div>
                <h1>Jarvis</h1>
            </div>
        </div>
      </header>

      {/* CHAT AREA */}
      <main className="chat-box">
        <div className="messages-wrapper">
            {messages.map((msg) => (
               <ChatBubble key={msg.id} message={msg} />
            ))}
            
            {isLoading && (
                 <div className="message bot">
                    <div className="avatar" style={{background: 'transparent'}}>🤖</div>
                    <div className="message-content" style={{padding: '10px 20px'}}>Thinking...</div>
                 </div>
            )}
            <div ref={chatEndRef} />
        </div>
      </main>

      {/* SEPARATED INPUT AREA */}
      <div className="input-area">
        
        {/* AREA 1: The Text Capsule */}
        <div className="gemini-capsule-border">
            <div className="gemini-capsule-inner">
                <textarea
                    ref={textareaRef}
                    placeholder="Ask Jarvis..."
                    value={inputText}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    rows={1}
                />
            </div>
        </div>

        {/* AREA 2: The Separate Button */}
        <div className="action-button-wrapper">
            {inputText.trim() ? (
                <button type="submit" className="action-btn send-btn" onClick={handleTextSubmit} disabled={isLoading}>
                    <FaArrowUp /> 
                </button>
            ) : (
                <VoiceRecorder onRecordingComplete={handleVoiceUpload} />
            )}
        </div>

      </div>
    </div>
  );
}

export default App;