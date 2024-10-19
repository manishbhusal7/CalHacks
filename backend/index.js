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
const GROQ_API_KEY="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";
const groq = new Groq({
  apiKey: GROQ_API_KEY, // Make sure to set this environment variable
});

app.use(cors());

app.post('/upload', upload.single('audio'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    // Rename the file to have .mp3 extension
    const newPath = `${req.file.path}.mp3`;
    fs.renameSync(req.file.path, newPath);

    // Create a translation job
    const translation = await groq.audio.translations.create({
      file: fs.createReadStream(newPath),
      model: "whisper-large-v3",
      response_format: "json",
      temperature: 0.0,
    });

    // Delete the file after processing
    fs.unlinkSync(newPath);

    res.json({ transcription: translation.text });
  } catch (error) {
    console.error('Error processing audio:', error);
    res.status(500).send('Error processing audio');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});