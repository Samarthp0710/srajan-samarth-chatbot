import React from 'react';
import AudioPlayer from './AudioPlayer'; 
import { FaUser } from 'react-icons/fa'; // Removed FaRobot since we replaced it

// 1. IMPORT YOUR LOGO 
// We use ".." to go up one folder (out of components) and into "assets"
import botLogo from '../assets/logo.png'; 

const ChatBubble = ({ message }) => {
  const isBot = message.sender === 'bot';

  return (
    <div className={`message ${isBot ? 'bot' : 'user'}`}>
      
      {/* Avatar Logic */}
      {/* I added a check to make the background transparent for the image so it looks clean */}
      <div className="avatar" style={isBot ? { background: 'transparent', padding: 0 } : {}}>
        {isBot ? (
          // ✅ IF BOT: Show your custom logo image
          <img 
            src={botLogo} 
            alt="Bot" 
            style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              objectFit: 'cover' 
            }} 
          />
        ) : (
          // ✅ IF USER: Keep the standard User Icon
          <FaUser />
        )}
      </div>

      <div className="message-content">
        <p>{message.text}</p>

        {/* Audio Player (Only for Bot) */}
        {isBot && message.audioUrl && (
          <AudioPlayer audioUrl={message.audioUrl} />
        )}
      </div>
      
    </div>
  );
};

export default ChatBubble;