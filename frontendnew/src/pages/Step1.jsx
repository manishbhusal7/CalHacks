import { useTTS } from "@cartesia/cartesia-js/react";
import { faDove, faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation to Step2
import { createChatCompletion, translateAudio } from "../api";
import RecordButton from "../components/RecordAudioBtn";

import FileUpload from "../components/FileUpload";


function Step1() {
  // State for chat messages
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! How can I provide help for you today?" },
  ]);

  // State for user input
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // State for file upload
  const [isRecording, setIsRecording] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate for navigation

  // const handleFileChange = async (e) => {
  //   const selectedFile = e.target.files[0];

  //   // Check if it's a PDF file
  //   if (selectedFile && selectedFile.type === "application/pdf") {
  //     setFile(selectedFile);

  //     // Use PDF.js to extract the text
  //     const reader = new FileReader();

  //     reader.onload = async function () {
  //       const typedArray = new Uint8Array(this.result);

  //       const pdf = await pdfjsLib.getDocument(typedArray).promise;
  //       let extractedText = "";

  //       for (let i = 1; i <= pdf.numPages; i++) {
  //         const page = await pdf.getPage(i);
  //         const textContent = await page.getTextContent();
  //         const pageText = textContent.items.map((item) => item.str).join(" ");
  //         extractedText += pageText;
  //       }

  //       // Now you have the full extracted text
  //       createChatCompletion(extractedText); // Call the function to check medical relevance
  //     };

  //     reader.readAsArrayBuffer(selectedFile);
  //   } else {
  //     alert("Please upload a PDF file.");
  //   }
  // };

  const tts = useTTS({
    apiKey: "e43cbd2f-c25d-4eea-afeb-d6ce7264d19e",
    sampleRate: 44100,
  });

  const speakAloud = async (text) => {
    // Begin buffering the audio.
    const response = await tts.buffer({
      model_id: "sonic-english",
      voice: {
        mode: "id",
        id: "a0e99841-438c-4a64-b679-ae501e7d6091",
      },
      transcript: text,
    });

    // Immediately play the audio. (You can also buffer in advance and play later.)
    await tts.play();
  };

  const handleSubmit = async () => {
    if (input.trim() === "" && !file) return; // Ensure there's an input or file before submitting
    const userMessage = { role: "user", content: input };
    setMessages((prevHistory) => [...prevHistory, userMessage]);
    // Call the API to get the assistant's response
    const response = await createChatCompletion([...messages, userMessage]);
    // Append assistant response to chat history
    const assistantMessage = { role: "assistant", content: response };
    setMessages((prevHistory) => [...prevHistory, assistantMessage]);
    speakAloud(response);
  };

  const handleAudioTranslate = async (audioBlob) => {
    try {
      let resp = await translateAudio(audioBlob);
      let tranlsation = resp.text;
      console.log(!isRecording);
      setInput(tranlsation);
    } catch (error) {
      console.error("Error processing audio:", error);
    }
  };

  const navigateToNotes = () => {
    navigate("/archived-notes"); // Adjust this path as needed
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className="w-64 bg-indigo-950 text-white flex flex-col p-4">
        {/* <h1>
           const handleSubmit = async (event) => {
      e cite<span className="font-bold">wise</span>
        </h1>
        <h2 className="text-lg font-bold mb-6">Workspace</h2> */}
        <nav className="space-y-4">
          <button className="text-left w-full py-2 px-4 bg-indigo-900 hover:bg-gray-700 rounded-md">
            X Ray
          </button>
          <button
            className="text-left w-full py-2 px-4 bg-indigo-900 hover:bg-gray-700 rounded-md"
            onClick={navigateToNotes}
          >
            Dental Office
          </button>
          <button className="text-left w-full py-2 px-4 bg-indigo-900 hover:bg-gray-700 rounded-md">
            Prescriptions
          </button>
          <button className="text-left w-full py-2 px-4 bg-indigo-900 hover:bg-gray-700 rounded-md">
            Lab Results
          </button>
        </nav>
        {/* <div className="mt-auto">
          <button className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-md">
            Log Out
          </button>
        </div> */}
      </div>

      {/* Main Chat Section */}
      <div className="flex-grow flex flex-col items-center justify-center">
        <h1 className="text-2xl text-blue-950 font-bold text-center mb-4">
          <span className="font-normal">SympCare</span>
          AI
          <FontAwesomeIcon icon={faDove} className="ml-2" />
        </h1>

        <div className="h-8 bg-gray-200"></div>

        {/* Chat Section */}
        <div className="w-3/4 p-4 px-4 mx-2 bg-white rounded-lg shadow-lg">
          <div className="mb-4 space-y-2 overflow-auto h-80">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-3 rounded-md ${
                  message.role === "user"
                    ? "bg-blue-100 text-gray-700 text-right"
                    : "bg-gray-200 text-gray-700 text-left"
                }`}
              >
                <ul>
                  {message.content
                    .split("\n") // Split the content by line breaks
                    .filter((point) => point.trim() !== "") // Filter out empty lines
                    .map((point, index) => (
                      <li key={index}>{point}</li> // Wrap each line in <li> tags
                    ))}
                </ul>
              </div>
            ))}
            {loading && (
              <div className="p-3 bg-gray-200 rounded-md">Typing...</div>
            )}
          </div>

          <div className="flex items-center mt-4 space-x-2">
            <FileUpload  prevMessages={messages} addMessage={setMessages} speakAudio={speakAloud}/>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow p-2 bg-white text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <RecordButton
              getAudioCb={handleAudioTranslate}
              onClick={() => {
                console.log("clicked");
                setIsRecording(!isRecording);
              }}
              className={`${
                isRecording && "animate-bounce"
              }  px-4 py-2 text-white bg-blue-900 focus:bg-blue-600 rounded-full hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              {/* <span className="animate-bounce absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span> */}
              <FontAwesomeIcon className="" icon={faMicrophone} />
            </RecordButton>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-white bg-blue-900 focus:bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none  focus:ring-2 focus:ring-blue-500"
            >
              Ask
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step1;
