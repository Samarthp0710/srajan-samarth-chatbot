import React, { useState, useRef } from "react";
import { FaMicrophone, FaStop } from "react-icons/fa";

const VoiceRecorder = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/wav" });
        onRecordingComplete(blob);
        chunksRef.current = [];
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone Error:", err);
      alert("Please enable microphone access!");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <button
      type="button"
      onClick={isRecording ? stopRecording : startRecording}
      className={`p-3 rounded-full transition-all duration-300 flex items-center justify-center ${
        isRecording 
          ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/50" 
          : "text-gray-500 hover:bg-gray-100 hover:text-indigo-600"
      }`}
      title={isRecording ? "Stop Recording" : "Start Voice Input"}
    >
      {isRecording ? <FaStop className="text-xl" /> : <FaMicrophone className="text-xl" />}
    </button>
  );
};

export default VoiceRecorder;