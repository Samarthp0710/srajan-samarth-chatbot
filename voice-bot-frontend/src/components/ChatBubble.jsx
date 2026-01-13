import React from 'react';
import AudioPlayer from './AudioPlayer'; // We use our custom player because it looks better in Dark Mode
import { FaUser, FaRobot } from 'react-icons/fa';

const ChatBubble = ({ message }) => {
  const isBot = message.sender === 'bot';

  return (
    // The CSS class 'message' handles the layout. 
    // 'bot' or 'user' class tells CSS which side to align to.
    <div className={`message ${isBot ? 'bot' : 'user'}`}>
      
      {/* Avatar Logic: Show Robot for Bot, User icon for User */}
      <div className="avatar">
        {isBot ? <FaRobot /> : <FaUser />}
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