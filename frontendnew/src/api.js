import axios from "axios";

const GROQ_API_KEY = "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"; // Replace with your actual API key

/**
 * 
 * @param {array} chatHistory 
 * @returns 
 */
export const createChatCompletion = async (chatHistory) => {
    try {
      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama3-70b-8192",
          messages: [
            {
                role: "system",
                content:
                  'You are a medical chatbot. Always provide your responses as bullet points. Each piece of advice should be a separate bullet point, and there should be a line break after each bullet point. Only answer medical questions. If a question is irrelevant to medical issues, respond with "Sorry, this does not seem like a medical question."'
              },
            ...chatHistory
        ],
          max_tokens: 100,
          temperature: 1.2,
        },
        {
          headers: {
            Authorization: `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error("Error fetching response:", error);
      return "Sorry, I couldn't get a response.";
    }
  };

  export const geminiGetSummary = async (formData) => {
    // Replace with your backend URL
    const response = await fetch('http://localhost:5000/summarize', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to upload file'); // Handle non-2xx responses
    }

    const data = await response.json();
    if (data.error) {
        throw new Error(data.error); // Check for errors in the response
    }
    return data;

}

export async function transcribeAudio(audioBlob) {
  try {
    const formData = new FormData();
    formData.append("file", audioBlob, "sample_audio.mp3"); // Append the Blob
    formData.append("model", "whisper-large-v3");
    formData.append("response_format", "json");
    formData.append("temperature", "0.0");

    const response = await axios.post(
      "https://api.groq.com/openai/v1/audio/transcriptions",
      formData,
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
      }
    );
    console.log("Request successful"); // Debugging statement
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error processing audio:", error);
  }
}

export async function translateAudio(audioBlob) {
  try {
    const formData = new FormData();
    formData.append("file", audioBlob, "sample_audio.mp3"); // Append the Blob
    formData.append("model", "whisper-large-v3");
    formData.append("response_format", "json");
    formData.append("temperature", "0.0");

    const response = await axios.post(
      "https://api.groq.com/openai/v1/audio/translations",
      formData,
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
      }
    );
    console.log("Request successful"); // Debugging statement
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error processing audio:", error);
  }
}
