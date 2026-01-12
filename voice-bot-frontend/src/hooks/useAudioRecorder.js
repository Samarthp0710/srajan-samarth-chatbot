import { useState, useRef } from "react";

const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      // 1. Request Microphone Permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // 2. Setup Recorder
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = []; // Reset chunks

      // 3. Listen for data availability
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // 4. Start recording
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone Access Denied:", err);
      alert("Could not access microphone. Please check browser permissions.");
    }
  };

  const stopRecording = () => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current) return resolve(null);

      // Define what happens when it actually stops
      mediaRecorderRef.current.onstop = () => {
        // Combine all chunks into one audio file (Blob)
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        setIsRecording(false);
        resolve(audioBlob); // Return the file to the component
      };

      mediaRecorderRef.current.stop();
      // Stop all tracks to release the mic
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    });
  };

  return { isRecording, startRecording, stopRecording };
};

export default useAudioRecorder;