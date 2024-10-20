import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';
import { Groq } from 'groq-sdk';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { useTTS } from "@cartesia/cartesia-js/react";
import { createClient } from '@deepgram/sdk';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const upload = multer({ dest: 'uploads/' });
const GROQ_API_KEY = "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";
const groq = new Groq({
  apiKey: GROQ_API_KEY,
});
const deepgram = createClient("d2b66d678cc0281af3a5663185ab2cb631151d85");
app.use(cors());
app.use(express.json());
const tts = useTTS({
  apiKey: "6fa618a1-a478-413a-b765-b7addc6268b5",
  sampleRate: 44100,
});

app.post('/upload', upload.single('audio'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const newPath = `${req.file.path}.mp3`;
    fs.renameSync(req.file.path, newPath);

    const translation = await groq.audio.transcriptions.create({
      file: fs.createReadStream(newPath),
      model: "whisper-large-v3",
      response_format: "json",
      temperature: 0.0,
    });

    fs.unlinkSync(newPath);

    res.json({ transcription: translation.text });
  } catch (error) {
    console.error('Error processing audio:', error);
    res.status(500).send('Error processing audio');
  }
});



app.post("/generate-audio", async (req, res) => {
  const { text } = req.body;

  console.log(text);
  

  if (!text) {
    return res.status(400).send("Text is required");
  }

  try {
    // STEP 2: Make a request to generate audio using Deepgram
    const response = await deepgram.speak.request(
      { text },
      {
        model: "aura-asteria-en",
        encoding: "linear16",
        container: "wav",
      }
    );

    // STEP 3: Get the audio stream
    const stream = await response.getStream();
    if (!stream) {
      throw new Error("Error generating audio");
    }

    // STEP 4: Convert the stream to a buffer
    const buffer = await getAudioBuffer(stream);

    // STEP 5: Set headers and send the audio buffer to the frontend
    res.set({
      "Content-Type": "audio/wav",
      "Content-Length": buffer.length,
    });
    res.send(buffer); // Send audio file to the client
  } catch (error) {
    console.error("Error generating audio:", error);
    res.status(500).send("Error generating audio");
  }
});

// Helper function to convert stream to an audio buffer
const getAudioBuffer = async (response) => {
  const reader = response.getReader();
  const chunks = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  const dataArray = chunks.reduce(
    (acc, chunk) => Uint8Array.from([...acc, ...chunk]),
    new Uint8Array(0)
  );

  return Buffer.from(dataArray.buffer);
};

app.post('/chat', async (req, res) => {
  const { messages } = req.body;
  console.log(messages);
  

  try {
    const response = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "system",
          content: 'You are a medical chatbot. Give user tips on what to do in case of their input. You only give advice for medical response. Respond every word in the same language the user sends as an input. Any irrelevant question should be responded with "Sorry, this does not seem like a medical question."'
        },
        ...messages
      ],
      max_tokens: 100,
      temperature: 1.2,
    });

    res.json({ response: response.choices[0].message.content });
  } catch (error) {
    console.error('Error fetching chat response:', error);
    res.status(500).json({ error: "Sorry, I couldn't get a response." });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});