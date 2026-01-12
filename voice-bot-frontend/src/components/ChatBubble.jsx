import React from 'react';
import { FaRobot, FaUser } from "react-icons/fa";

const ChatBubble = ({ message }) => {
  const isUser = message.sender === "user";

  return (
    // This container stretches to fill the wide screen
    <div className={`flex w-full mt-6 ${isUser ? "justify-end" : "justify-start"}`}>
      
      <div className={`flex max-w-[85%] md:max-w-[75%] gap-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        
        {/* AVATAR */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
          isUser ? "bg-gray-200" : "bg-indigo-600"
        }`}>
          {isUser ? <FaUser className="text-gray-500" /> : <FaRobot className="text-white" />}
        </div>

        {/* BUBBLE */}
        <div className={`flex flex-col p-4 rounded-2xl shadow-sm text-base leading-relaxed ${
          isUser 
            ? "bg-indigo-600 text-white rounded-tr-none" 
            : "bg-gray-100 text-gray-800 border border-gray-200 rounded-tl-none"
        }`}>
          
          <p className="whitespace-pre-wrap">{message.text}</p>

          {/* AUDIO PLAYER */}
          {message.audioUrl && (
            <div className={`mt-3 pt-2 ${isUser ? "border-t border-indigo-500" : "border-t border-gray-300"}`}>
               <audio controls src={message.audioUrl} className="w-full h-10 min-w-[200px]" />
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ChatBubble;