import Groq from "groq-sdk";
import cors from 'cors';
import express from 'express';

const GROQ_API_KEY = "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"

const groq = new Groq({ apiKey: GROQ_API_KEY });

export async function getGroqChatCompletion(messages, model) {  
  return groq.chat.completions.create({ 
    messages: [
      {
        role: "user",
        content: "Explain the importance of fast language models",
      },
    ],
    model: "llama3-8b-8192",
  });
}

const app = express();
app.use(cors());
const port = 3000;

app.use(express.json());

app.post('/chat', async (req, res) => {
  try {
    const { messages, model } = req.body;
    const completion = await getGroqChatCompletion(messages, model);
      // Print the completion returned by the LLM.
    console.log(`Received request: ${JSON.stringify(req.body)}`);
    // console.log(`Returning completion: ${JSON.stringify(completion)}`);
    res.json(completion);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});