
import { useState } from "react";

// eslint-disable-next-line react/prop-types
function RecordButton ({getAudioCb, className, children }) {
    // eslint-disable-next-line react/prop-types
    
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [isRecording, setIsRecording] = useState(false);

    const handleStartRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mr = new MediaRecorder(stream);
            setMediaRecorder(mr);

            const audioChunks = [];

            mr.addEventListener("dataavailable", (event) => {
                audioChunks.push(event.data);
            });

            mr.addEventListener("stop", () => {
                const audioBlob = new Blob(audioChunks,  { type: 'audio/mp3' });
                console.log(audioBlob)
                const url = URL.createObjectURL(audioBlob);
                if (url) {
                    const audio = new Audio(url);
                    getAudioCb(audioBlob);
                    audio.play();
                    setIsRecording();
                }
            });

            mr.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Error accessing microphone:", err);
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            setIsRecording(false);
        }
    }

    return (
        <button className={className} onClick={isRecording ? handleStopRecording : handleStartRecording}>
            {children}
        </button>
    );
};
export default RecordButton;