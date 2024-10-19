
    
    
    import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB using the connection string from .env
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Define chat message schema
const chatSchema = new mongoose.Schema({
    conversation_id: String,
    sender_id: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
});

// Create chat model
const Chat = mongoose.model('Chat', chatSchema);

// Route to get all messages
app.get('/api', async (req, res) => {
    try {
        const messages = await Chat.find();
        res.json(messages);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Route to post a new message
app.post('/api/messages', async (req, res) => {
    const { conversation_id, sender_id, message } = req.body;
    const newMessage = new Chat({ conversation_id, sender_id, message });
    try {
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


