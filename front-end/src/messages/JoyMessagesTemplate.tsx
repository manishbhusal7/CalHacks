import React, { useState } from "react";
import axios from "axios";
import "../../src/App.css";

const GROQ_API_KEY = "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"; // Replace with your actual API key

const App = () => {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      role: "system",
      content:
        'You are a medical chatbot. Tell the user what to do based on their questions. You only give advice for medical response. Any irrelevant question should be responded with "Sorry, this does not seem like a medical question."',
    },
  ]);

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async () => {
    if (!userInput.trim()) return;

    // Append user input to chat history
    const userMessage = { role: "user", content: userInput };
    setChatHistory((prevHistory) => [...prevHistory, userMessage]);

    // Call the API to get the assistant's response
    const response = await createChatCompletion([...chatHistory, userMessage]);

    // Append assistant response to chat history
    const assistantMessage = { role: "assistant", content: response };
    setChatHistory((prevHistory) => [...prevHistory, assistantMessage]);

    // Clear the input
    setUserInput("");
  };

  const createChatCompletion = async (chatHistory) => {
    try {
      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama3-70b-8192",
          messages: chatHistory,
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

  return (
    <div className="container">
      <h1>Medical Chatbot</h1>
      <div className="chatbox">
        {chatHistory.map((message, index) => (
          <div
            key={index}
            className={
              message.role === "user" ? "user-message" : "assistant-message"
            }
          >
            <strong>{message.role === "user" ? "You" : "Assistant"}:</strong>{" "}
            {message.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={userInput}
        onChange={handleInputChange}
        placeholder="Ask a medical question..."
      />
      <button onClick={handleSubmit}>Send</button>
    </div>
  );
};

export default App;
