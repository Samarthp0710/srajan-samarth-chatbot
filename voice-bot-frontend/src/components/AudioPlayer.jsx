import React, { useRef, useState } from 'react';
import { FaVolumeUp, FaStop } from 'react-icons/fa';

const AudioPlayer = ({ audioUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio(audioUrl));

  const togglePlay = () => {
    const audio = audioRef.current;

    if (isPlaying) {
      audio.pause();
      audio.currentTime = 0; // Reset to start
      setIsPlaying(false);
    } else {
      audio.play().catch(e => console.error("Playback error:", e));
      setIsPlaying(true);
      
      // Reset button state when audio finishes
      audio.onended = () => setIsPlaying(false);
    }
  };

  return (
    <button 
      onClick={togglePlay} 
      className="play-btn"
      style={{
        display: 'flex', alignItems: 'center', gap: '5px',
        marginTop: '8px', padding: '6px 12px',
        background: isPlaying ? '#dc3545' : '#007bff', // Red if playing, Blue if stopped
        color: 'white', border: 'none', borderRadius: '20px', 
        fontSize: '0.85rem', cursor: 'pointer', transition: 'background 0.2s'
      }}
    >
      {isPlaying ? <FaStop /> : <FaVolumeUp />}
      {isPlaying ? "Stop" : "Play Voice"}
    </button>
  );
};

export default AudioPlayer;