import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid'; 

// React Icons
import { FaPaperPlane, FaMicrophone, FaRobot, FaCircle, FaArrowUp } from "react-icons/fa"; 

// Components
import ChatBubble from "./components/ChatBubble";
import VoiceRecorder from "./components/VoiceRecorder";
import { sendTextMessage, sendVoiceMessage } from "./services/api";

// Styles
import "./styles/App.css"; 

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function App() {
  // --- LOGIC (UNCHANGED) ---
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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (sender, text, audioPath = null) => {
    const fullAudioUrl = audioPath ? `${BACKEND_URL}/${audioPath}` : null;
    setMessages((prev) => [
      ...prev,
      { id: uuidv4(), sender, text, audioUrl: fullAudioUrl },
    ]);
  };

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const text = inputText;
    setInputText(""); 
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
    addMessage("user", "🎤 (Sending Voice Note...)");
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

  // --- NEW "ULTRA WIDE" UI ---
  return (
    <div className="flex flex-col h-screen bg-white font-sans">
      
      {/* 1. HEADER (Full Width) */}
      <header className="bg-indigo-600 text-white p-4 shadow-sm z-10 sticky top-0">
        <div className="w-full px-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                    <FaRobot className="text-xl" />
                </div>
                <div>
                    <h1 className="font-bold text-xl tracking-wide">VoiceBot AI</h1>
                    <p className="text-xs text-indigo-200 flex items-center gap-1">
                        <FaCircle className="text-[8px] text-green-400" /> Always Online
                    </p>
                </div>
            </div>
        </div>
      </header>

      {/* 2. CHAT AREA (Fills 90% of screen) */}
      <main className="flex-1 overflow-y-auto p-6 scroll-smooth relative bg-white">
        {/* Changed max-w-3xl to max-w-[90%] or w-full */}
        <div className="w-full max-w-[95%] mx-auto space-y-6 pb-40">
            
            {/* Map Messages */}
            {messages.map((msg) => (
               <ChatBubble key={msg.id} message={msg} />
            ))}
            
            {/* Loading Indicator */}
            {isLoading && (
                 <div className="flex justify-start animate-pulse">
                    <div className="bg-gray-100 border border-gray-200 text-gray-500 px-6 py-4 rounded-2xl rounded-tl-none text-sm shadow-sm">
                        Thinking...
                    </div>
                 </div>
            )}
            
            <div ref={chatEndRef} />
        </div>
      </main>

      {/* 3. FLOATING INPUT BAR (Stretches with screen) */}
      <div className="fixed bottom-0 left-0 w-full bg-gradient-to-t from-white via-white to-transparent pb-6 pt-10">
        <div className="w-full max-w-[90%] mx-auto px-4">
            <div className="bg-white border border-gray-300 rounded-full shadow-2xl flex items-center p-3 gap-3 transition-all hover:border-indigo-300 hover:shadow-indigo-500/20">
                
                {/* Voice Recorder */}
                <div className="pl-2">
                    <VoiceRecorder onRecordingComplete={handleVoiceUpload} />
                </div>

                {/* Text Input */}
                <form onSubmit={handleTextSubmit} className="flex-1 flex items-center">
                    <input
                    type="text"
                    className="flex-1 bg-transparent px-4 py-3 text-base focus:outline-none text-gray-700 placeholder-gray-400"
                    placeholder="Message VoiceBot..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    disabled={isLoading}
                    />
                    
                    {/* Send Button */}
                    <button 
                        type="submit" 
                        disabled={!inputText.trim() || isLoading}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform transform hover:scale-105 active:scale-95 disabled:bg-gray-300 disabled:scale-100"
                    >
                    <FaArrowUp className="text-lg" />
                    </button>
                </form>
            </div>
            <p className="text-center text-xs text-gray-400 mt-3">
                VoiceBot can make mistakes. Please verify important information.
            </p>
        </div>
      </div>

    </div>
  );
}

export default App;