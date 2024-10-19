import axios from "axios";

const fetchApiData = async (chatMessages) => {
  try {
    const response = await axios.post("/api/groq-chat", {
      model: "llama3-70b-8192",
      messages: chatMessages, // Send the chat history
      max_tokens: 100,
      temperature: 1.2,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching from Groq API:", error);
    throw error;
  }
};

export default fetchApiData;
