import React, { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import  Microphone  from '../assets/microphone';
import MicrophoneOn from '../assets/microphoneon';
import { useDispatch, useSelector } from "react-redux";
import { addList, emptyAllRes, insertNew, livePrompt } from "../redux/messages";

const AudioRecorderAndChat = (props) => {
  const dispatch = useDispatch();
  const [isRecording, setIsRecording] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState('');
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
    let chatsId = Date.now();
    let res;
    setIsSending(true);
    const formData = new FormData();
    formData.append('audio', blob, 'recording.mp3');

    try {
      res = await axios.post('http://localhost:3001/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setTranscription(res.data.transcription);
      setUserInput(res.data.transcription);

      
    } catch (error) {
      console.error('Error sending audio to backend:', error);
      setTranscription('Error processing audio');
    } finally {
      setIsSending(false);
      console.log(res);
      if (res?.data) {
        console.log(res);
        const  content = res?.data?.transcription;
        console.log(content);
        dispatch(livePrompt(content));
      }
    }
  }, []);

  const handleStop = useCallback(() => {
    const blob = new Blob(chunksRef.current, { type: 'audio/mp3' });
    chunksRef.current = [];
    sendAudioToBackend(blob);
  }, [sendAudioToBackend]);


  const handleSubmit = async () => {
    if (!userInput.trim()) return;

    const userMessage = { role: "user", content: userInput };
    setChatHistory((prevHistory) => [...prevHistory, userMessage]);
    let res;
    try {
      const res = await axios.post('http://localhost:3001/chat', {
        messages: [...chatHistory, userMessage]
      });
      console.log(res);
      
      const assistantMessage = { role: "assistant", content: res.data.response };
      setChatHistory((prevHistory) => [...prevHistory, assistantMessage]);
    } catch (error) {
      console.error('Error fetching chat response:', error);
      const errorMessage = { role: "assistant", content: "Sorry, I couldn't get a response." };
      setChatHistory((prevHistory) => [...prevHistory, errorMessage]);
    }finally {
      if (res?.data) {

        const  content = res?.data?.res;
        this.props.setConversation(content);
        console.log(content);
        const messaeQ = "SDSDFDSfsdf"
        dispatch(insertNew({messaeQ, fullContent: content, chatsId }));
        chatRef?.current?.loadResponse(stateAction, content, chatsId);
        stateAction({ type: "error", status: false });
      }
    }
  };  
  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  return (

    // <div>
    //   <button
    //       className={` `}
    //       onClick={isRecording ? stopRecording : startRecording}
    //       disabled={isSending}
    //     >
    //      {isRecording ? < MicrophoneOn/>: <Microphone/>}
    //     </button>
    // </div>
    
    <div className="p-4">
      <div>
      <button
          onClick={isRecording ? stopRecording : startRecording}
           disabled={isSending}
         >
          {isRecording ? < MicrophoneOn/>: <Microphone/>}
         </button>
     </div> 
      {/* <h1 className="text-2xl font-bold mb-4">Audio Recorder and Medical Chat</h1>
      <div className="space-x-2 mb-4">
        <button
          className={`px-4 py-2 rounded ${isRecording ? 'bg-red-500' : 'bg-blue-500'} text-white`}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isSending}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
      </div>
      {isSending && <p className="mt-2">Processing audio...</p>}
      {transcription && (
        <div className="mt-4 mb-4">
          <h2 className="text-xl font-semibold">Transcription:</h2>
          <p>{transcription}</p>
        </div>
      )}
      <div className="mt-4">
        <textarea
          className="w-full p-2 border rounded"
          rows="3"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Type your message or use transcription..."
        />
        <button
          className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
          onClick={handleSubmit}
        >
          Send
        </button>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Chat History:</h2>
        {chatHistory.map((message, index) => (
          <div key={index} className={`mt-2 ${message.role === 'user' ? 'text-blue-600' : 'text-green-600'}`}>
            <strong>{message.role === 'user' ? 'You: ' : 'Assistant: '}</strong>
            {message.content}
          </div>
        ))}
      </div>*/}
    </div> 
  );
};

export default AudioRecorderAndChat;