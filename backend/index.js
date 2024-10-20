import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';
import { Groq } from 'groq-sdk';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const upload = multer({ dest: 'uploads/' });
const GROQ_API_KEY = "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";
const groq = new Groq({
  apiKey: GROQ_API_KEY,
});

app.use(cors());
app.use(express.json());

app.post('/upload', upload.single('audio'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const newPath = `${req.file.path}.mp3`;
    fs.renameSync(req.file.path, newPath);

    const translation = await groq.audio.translations.create({
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

app.post('/chat', async (req, res) => {
  const { messages } = req.body;

  console.log(messages);
  

  try {
    const response = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "system",
          content: 'You are a medical chatbot. Tell the user what to do based on their questions. You only give advice for medical response. Any irrelevant question should be responded with "Sorry, this does not seem like a medical question."'
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