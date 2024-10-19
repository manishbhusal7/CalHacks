import * as React from "react";
import Box from "@mui/joy/Box";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import AvatarWithStatus from "./AvatarWithStatus";
import ChatBubble from "./ChatBubble";
import MessageInput from "./MessageInput";
import MessagesPaneHeader from "./MessagesPaneHeader";
import { ChatProps, MessageProps } from "../types";
import { useState } from "react";
import fetchApiData from "../../api";

type MessagesPaneProps = {
  chat: ChatProps;
};

export default function MessagesPane(props: MessagesPaneProps) {
  const { chat } = props;

  // Initialize chat history with system prompt
  const systemPrompt = {
    role: "system",
    content:
      "You are a medical chatbot. You only give advice for medical response. Any irrelevant question should be responded with 'Sorry, this does not seem like a medical question.'",
  };

  const [chatMessages, setChatMessages] = useState([
    systemPrompt,
    ...chat.messages,
  ]);
  const [textAreaValue, setTextAreaValue] = useState("");
  const [apiData, setApiData] = useState(null);

  // Handle form submission
  const onSubmit = async () => {
    if (!textAreaValue.trim()) return; // Prevent empty submissions

    const newId = chatMessages.length + 1;
    const newIdString = newId.toString();

    // Add the user's message to the chat history
    const userMessage = {
      id: newIdString,
      role: "user",
      sender: "You",
      content: textAreaValue,
      timestamp: "Just now",
    };

    const updatedChatMessages = [...chatMessages, userMessage];
    setChatMessages(updatedChatMessages);

    try {
      // Fetch the chatbot's response from the API
      const data = await fetchApiData(updatedChatMessages);
      setApiData(data);

      // Extract the chatbot's response message
      const botMessage = {
        id: (updatedChatMessages.length + 1).toString(),
        role: "assistant",
        sender: "bot",
        content: data.choices[0].message.content,
        timestamp: "Just now",
      };

      // Add the chatbot's response to the chat
      setChatMessages([...updatedChatMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }

    // Clear the input field after submission
    setTextAreaValue("");
  };

  React.useEffect(() => {
    setChatMessages([systemPrompt, ...chat.messages]);
  }, [chat.messages]);

  return (
    <Sheet
      sx={{
        height: { xs: "calc(100dvh - var(--Header-height))", md: "100dvh" },
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.level1",
      }}
    >
      <MessagesPaneHeader sender={chat.sender} />
      <Box
        sx={{
          display: "flex",
          flex: 1,
          minHeight: 0,
          px: 2,
          py: 3,
          overflowY: "scroll",
          flexDirection: "column-reverse",
        }}
      >
        <Stack spacing={2} sx={{ justifyContent: "flex-end" }}>
          {chatMessages.map((message: MessageProps, index: number) => {
            const isYou = message.sender === "You";
            return (
              <Stack
                key={index}
                direction="row"
                spacing={2}
                sx={{ flexDirection: isYou ? "row-reverse" : "row" }}
              >
                {message.sender !== "You" && (
                  <AvatarWithStatus
                  // Add the user's avatar or bot's avatar if needed
                  />
                )}
                <ChatBubble
                  variant={isYou ? "sent" : "received"}
                  {...message}
                />
              </Stack>
            );
          })}
        </Stack>
      </Box>
      <MessageInput
        textAreaValue={textAreaValue}
        setTextAreaValue={setTextAreaValue}
        onSubmit={onSubmit}
      />
    </Sheet>
  );
}
