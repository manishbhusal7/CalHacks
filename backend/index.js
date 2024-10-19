// index.js

import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import { createClient } from "@deepgram/sdk";


dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());

// Set up multer for file uploads
const upload = multer({
    limits: { fileSize: 10 * 1024 * 1024 }, // Set a 10 MB limit (adjust as needed)
});

// Initialize the Deepgram client
const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

// Endpoint to transcribe audio file
app.post('/api/transcribe', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    // Create a buffer from the uploaded file
    const audioBuffer = req.file.buffer;

    try {
        // Call the Deepgram transcription API
        const { result, error } =  await deepgram.listen.prerecorded.transcribeFile(
          audioBuffer,
            {
                model: 'nova-2', // Specify the model to use
            }
        );

        // Check for errors
        if (error) {
            throw error;
        }

        // Return the transcription result
        res.json({ transcription: result });
    } catch (error) {
        console.error('Error during transcription:', error);
        res.status(500).json({ error: 'Transcription failed', details: error });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
