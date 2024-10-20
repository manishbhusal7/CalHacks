import React, { useEffect, useState, useReducer, useRef } from "react";
import { Reload, Rocket, Stop } from "../assets";
import { Chat, New } from "../components";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { setLoading } from "../redux/loading";
import { useDispatch, useSelector } from "react-redux";
import { addList, emptyAllRes, insertNew, livePrompt } from "../redux/messages";
import { emptyUser } from "../redux/user";
import instance from "../config/instance";
import axios from 'axios';
import "./style.scss";
import AudioRecorder from "./AudioRecorder";
const reducer = (state, { type, status }) => {
  switch (type) {
    case "chat":
      return {
        chat: status,
        loading: status,
        resume: status,
        actionBtns: false,
      };
    case "error":
      return {
        chat: true,
        error: status,
        resume: state.resume,
        loading: state.loading,
        actionBtns: state.actionBtns,
      };
    case "resume":
      return {
        chat: true,
        resume: status,
        loading: status,
        actionBtns: true,
      };
    default:
      return state;
  }
};

const Main = () => {
  let location = useLocation();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const chatRef = useRef();

  const { user } = useSelector((state) => state);

  const { id = null } = useParams();

  const [status, stateAction] = useReducer(reducer, {
    chat: false,
    error: false,
    actionBtns: false,
  });

  useEffect(() => {
    if (user) {
      dispatch(emptyAllRes());
      setTimeout(() => {
        if (id) {
          const getSaved = async () => {
            let res = null;
            try {
              res = await instance.get("/api/chat/saved", {
                params: {
                  chatId: id,
                },
              });
            } catch (err) {
              console.log(err);
              if (err?.response?.data?.status === 404) {
                navigate("/404");
              } else {
                alert(err);
                dispatch(setLoading(false));
              }
            } finally {
              if (res?.data) {
                dispatch(addList({ _id: id, items: res?.data?.data }));
                stateAction({ type: "resume", status: false });
                dispatch(setLoading(false));
              }
            }
          };

          getSaved();
        } else {
          stateAction({ type: "chat", status: false });
          dispatch(setLoading(false));
        }
      }, 1000);
    }
  }, [location]);

  return (
    <div className="main">
      <div className="contentArea">
        {status.chat ? <Chat ref={chatRef} error={status.error} /> : <New />}
      </div>

      <InputArea status={status} chatRef={chatRef} stateAction={stateAction} />
    </div>
  );
};

export default Main;

//Input Area
const InputArea = ({ status, chatRef, stateAction }) => {
  let textAreaRef = useRef();
  const [text, setText] = useState("");

  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState('');

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { prompt, content, _id } = useSelector((state) => state.messages);

  useEffect(() => {
    textAreaRef.current?.addEventListener("input", (e) => {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height =
        textAreaRef.current.scrollHeight + "px";
    });
  });

  const FormHandle = async () => {
    if (prompt?.length > 0) {
      stateAction({ type: "chat", status: true });

      let chatsId = Date.now();

      dispatch(insertNew({ id: chatsId, content: "", prompt }));
      chatRef?.current?.clearResponse();

      let res = null;
    // if (!userInput.trim()) return;
   
    stateAction({ type: "chat", status: true });
    const userMessage = { role: "user", content: prompt };
    setChatHistory((prevHistory) => [...prevHistory, userMessage]);

    try {
      res = await axios.post('http://localhost:3001/chat', {
        messages: [...chatHistory, userMessage]
      });
      console.log(res.data.response);
      const assistantMessage = { role: "assistant", content: res.data.response };
      setChatHistory((prevHistory) => [...prevHistory, assistantMessage]);
    } catch (error) {
      console.error('Error fetching chat response:', error);
      const errorMessage = { role: "assistant", content: "Sorry, I couldn't get a response." };
      setChatHistory((prevHistory) => [...prevHistory, errorMessage]);
      console.log(err);
      if (err?.response?.data?.status === 405) {
        dispatch(emptyUser());
        dispatch(emptyAllRes());
      } else {
        stateAction({ type: "error", status: true });
      }
    } finally {
      if (res?.data) {

        const  content = res?.data?.response;
        console.log(content);
        const messaeQ = "SDSDFDSfsdf"
        dispatch(insertNew({messaeQ, fullContent: content, chatsId }));
        chatRef?.current?.loadResponse(stateAction, content, chatsId);
        stateAction({ type: "error", status: false });
        fetchAudio(content);
      }
    }
    dispatch(livePrompt(""));

    setUserInput("");
    }
  };
  const [audioUrl, setAudioUrl] = useState(null);
  const audioRef = useRef(null); // Reference for the audio element

  const fetchAudio = async (content) => {
    try {
      const textToSend = "Hello, how can I help you today?"; // Example text

      // Send a POST request to the backend with the text to generate audio
      const response = await fetch("http://localhost:3001/generate-audio", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: content }), // Send the text as JSON
      });

      if (!response.ok) {
        throw new Error('Failed to fetch audio');
      }

      console.log(response);
      

      const reader = response.body.getReader();
        const chunks = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
        }

        // Combine the chunks into a single Uint8Array
        const audioBuffer = new Uint8Array(chunks.reduce((acc, chunk) => acc.concat(Array.from(chunk)), []));

        // Create a Blob from the buffer and generate an audio URL
        const blob = new Blob([audioBuffer], { type: 'audio/m4a' });
        const audioUrl = URL.createObjectURL(blob);

        // Create an Audio object and play the audio programmatically
        const audio = new Audio(audioUrl);
        await audio.play();
    } catch (error) {
      console.error("Error fetching audio:", error);
    }
  };

  return (
    <div className="inputArea">
 
      {!status.error ? (
        <>
        <div style={{position:"absolute", background:"transparent", display:"flex", marginLeft:"550px", marginTop:"-40px"}}>
        <AudioRecorder />
        </div>
          <div className="chatActionsLg">
            {status.chat && content?.length > 0 && status.actionBtns && (
              <>
              
                {!status?.resume ? (
                               
                  <button
                    onClick={() => {
                      chatRef.current.loadResponse(stateAction);
                    }}
                  >
                    <Reload /> Regenerate response
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      chatRef.current.stopResponse(stateAction);
                    }}
                  >
                    <Stop /> Stop generating
                  </button>
                )}
              </>
            )}
          </div>

          <div className="flexBody">
            <div className="box">
              <textarea
                placeholder="Send a message..."
                ref={textAreaRef}
                value={prompt}
                onChange={(e) => {
                  setUserInput(e.target.value);
                  dispatch(livePrompt(e.target.value));
                }}
              />
              {!status?.loading ? (
                <button onClick={FormHandle}>{<Rocket />}</button>
              ) : (
                <div className="loading">
                  <div className="dot" />
                  <div className="dot-2 dot" />
                  <div className="dot-3 dot" />
                </div>
              )}
            </div>

            {status.chat && content?.length > 0 && status.actionBtns && (
              <>
                {!status?.resume ? (
                  <div className="chatActionsMd">
                    <button
                      onClick={() => {
                        chatRef.current.loadResponse(stateAction);
                      }}
                    >
                      <Reload />
                    </button>
                  </div>
                ) : (
                  <div className="chatActionsMd">
                    <button
                      onClick={() => {
                        chatRef.current.stopResponse(stateAction);
                      }}
                    >
                      <Stop />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      ) : (
        <div className="error">
          <p>There was an error generating a response</p>
          <button onClick={FormHandle}>
            <Reload />
            Regenerate response
          </button>
        </div>
      )}

      <div className="text">
        <a
          target="_blank"
          href="https://help.openai.com/en/articles/6825453-chatgpt-release-notes"
        >
          ChatGPT Mar 14 Version.
        </a>{" "}
        Free Research Preview. Our goal is to make AI systems more natural and
        safe to interact with. Your feedback will help us improve.
      </div>
    </div>
  );
};
