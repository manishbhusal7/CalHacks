import React, { useState, useRef, useCallback } from 'react';
import axios from 'axios';

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [transcription, setTranscription] = useState('');
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.addEventListener('dataavailable', handleDataAvailable);
    mediaRecorderRef.current.addEventListener('stop', handleStop);
    mediaRecorderRef.current.start();
    setIsRecording(true);
    setTranscription('');
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleDataAvailable = (e) => {
    if (e.data.size > 0) {
      chunksRef.current.push(e.data);
    }
  };

  const sendAudioToBackend = useCallback(async (blob) => {
    setIsSending(true);
    const formData = new FormData();
    formData.append('audio', blob, 'recording.mp3');

    try {
      const response = await axios.post('http://localhost:3001/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setTranscription(response.data.transcription);
    } catch (error) {
      console.error('Error sending audio to backend:', error);
      setTranscription('Error processing audio');
    } finally {
      setIsSending(false);
    }
  }, []);

  const handleStop = useCallback(() => {
    const blob = new Blob(chunksRef.current, { type: 'audio/mp3' });
    chunksRef.current = [];
    sendAudioToBackend(blob);
  }, [sendAudioToBackend]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Audio Recorder</h1>
      <div className="space-x-2">
        <button
          className={`px-4 py-2 rounded ${isRecording ? 'bg-red-500' : 'bg-blue-500'} text-white`}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isSending}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
      </div>
      {isSending && <p className="mt-4">Sending audio to backend...</p>}
      {transcription && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Transcription:</h2>
          <p>{transcription}</p>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;