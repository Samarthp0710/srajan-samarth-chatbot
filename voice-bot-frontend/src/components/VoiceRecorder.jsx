import React from 'react';
import { FaMicrophone, FaStop } from 'react-icons/fa';
import useAudioRecorder from '../hooks/useAudioRecorder';

const VoiceRecorder = ({ onRecordingComplete }) => {
  const { isRecording, startRecording, stopRecording } = useAudioRecorder();

  return (
    <button
      className={`action-btn mic-btn ${isRecording ? "recording" : ""}`}
      onMouseDown={startRecording}
      onMouseUp={async () => {
        const blob = await stopRecording();
        if (blob) onRecordingComplete(blob);
      }}
      onTouchStart={startRecording}
      onTouchEnd={async () => {
        const blob = await stopRecording();
        if (blob) onRecordingComplete(blob);
      }}
      title={isRecording ? "Release to Send" : "Hold to Speak"}
      type="button" // Prevents form submission
    >
      {isRecording ? <FaStop /> : <FaMicrophone />}
    </button>
  );
};

export default VoiceRecorder;