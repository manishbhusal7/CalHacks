import React, { useState } from "react";
import { useTTS } from "@cartesia/cartesia-js/react";

export default function TextToSpeech() {
  const tts = useTTS({
    apiKey: "6fa618a1-a478-413a-b765-b7addc6268b5",
    sampleRate: 44100,
  });

  const [text, setText] = useState("");

  const handlePlay = async () => {
    // Begin buffering the audio.
    const response = await tts.buffer({
      model_id: "sonic-multilingual",
      voice: {
        mode: "id",
        id: "a0e99841-438c-4a64-b679-ae501e7d6091",
      },
      transcript: text,
      language: "hi",
    });

    // Immediately play the audio. (You can also buffer in advance and play later.)
    await tts.play();
  };

  return (
    <div>
      <input
        type="text"
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
      <button onClick={handlePlay}>Play</button>

      <div>
        {tts.playbackStatus} | {tts.bufferStatus} | {tts.isWaiting}
      </div>
    </div>
  );
}
