import Groq from "groq-sdk";
import cors from "cors";
import express from "express";

const GROQ_API_KEY = "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";

const groq = new Groq({ apiKey: GROQ_API_KEY });

export async function getGroqChatCompletion(data) {
  console.log(`Received messages: ${JSON.stringify(data)}`);
  return groq.chat.completions.create(data);
}

const app = express();
app.use(cors());
const port = 3000;

app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    console.log(`Received body: ${JSON.stringify(req.body)}`);
    const { data, headers } = req.body;
    const completion = await getGroqChatCompletion(data);
    // Print the completion returned by the LLM.
    console.log(`Received request: ${JSON.stringify(req.body)}`);
    // console.log(`Returning completion: ${JSON.stringify(completion)}`);
    res.json(completion);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error(error);
  }
});

app.post("/transcribe", async (req, res) => {
  try {
    console.log(`Received body: ${JSON.stringify(req.body)}`);
    const { data, headers } = req.body;
    const completion = await groq.
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
