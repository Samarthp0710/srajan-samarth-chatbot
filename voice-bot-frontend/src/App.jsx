import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid'; 
import { FaRobot, FaCircle, FaArrowUp } from "react-icons/fa"; 

import ChatBubble from "./components/ChatBubble";
import VoiceRecorder from "./components/VoiceRecorder";
import { sendTextMessage, sendVoiceMessage } from "./services/api";
import "./styles/App.css"; 

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function App() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hello! I am your AI assistant. Speak or type in any language!",
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
    addMessage("user", " [Voice Message]");
    setIsLoading(true);
    try {
      const data = await sendVoiceMessage(audioBlob);
      addMessage("bot", data.bot_text, data.bot_audio);
    } catch (error) {
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
                <FaRobot />
            </div>
            <div>
                <h1>VoiceBot AI</h1>
                <p className="status"><FaCircle className="status-dot" /> Online</p>
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
                    placeholder="Ask VoiceBot..."
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