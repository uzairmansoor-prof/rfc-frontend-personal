/* eslint-disable prettier/prettier */
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { useState } from "react";
// import netsolAvatar from "../../assets/images/netsol_logo.svg";
import "./style.scss";

import { MessageType } from "@/assets/contracts/message";
import HeroText from "./HeroText";

import { ChatHistoryEntry } from "@/assets/contracts/message";
import {
  MainContainer,
  ChatContainer,
  ConversationHeader,
  MessageList,
  Message,
  MessageInput,
} from "@heropana/chat-ui-kit-react";

import { useChatBotConversationMutation } from "@/redux/chat-bot/chat-bot-api";
import { SpinnerInfinity } from "spinners-react";
import ChatHeader from "./ChatHeader";

// for the time being I've places this url here, but this type of info needs to store in .env file
const url =
  "https://76n9i9hrp9.execute-api.us-east-1.amazonaws.com/genai-app-poc-ApiStage/api/v1/llm/rag";

const url2 = "http://localhost:3000/chat-messages";

interface MessageContent {
  type: string;
  text: string;
}
interface MessageArrayItem {
  direction: "outgoing" | "incoming";
  message: string;
  position: string;
  sender: string;
  sentTime: string;
}
interface Message {
  role: "user" | "assistant";
  content: MessageContent[];
}

interface Props {
  show: boolean;
  setShow: (value: boolean | ((prevStat: boolean) => boolean)) => void;
  messages: MessageType[];
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
  // messagesT: ChatMessage[];
}

const ChatMessageComponent = ({
  show,
  setShow,
  messages,
  setMessages,
}: Props) => {
  const [gettingResponse] = useChatBotConversationMutation();

  const [loading, setLoading] = useState(false);

  // const filterResponse = async (response) => {
  //   console.log("Original response data:", response); // Check if data exists

  //   const filteredData = response.filter((item) => item.role === "assistant");
  //   console.log("Filtered data:", filteredData);

  //   return filteredData;
  // };
  const createBody = (messageArray: MessageArrayItem[]): Message[] => {
    // console.log("messageArray in create body", messageArray);
    if (messageArray.length === 0) {
      // Return an empty body structure if no messages are present
      return [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "",
            },
          ],
        },
      ];
    }

    // Filter and map only outgoing messages to the body structure
    return messageArray
      .filter((msg) => msg.direction === "outgoing")
      .map((msg) => ({
        role: "user",
        content: [
          {
            type: "text",
            text: msg.message,
          },
        ],
      }));
  };
  const sendMessage = async (messages, value) => {
    const body = createBody(messages);
    // console.log("making body of api response", body);
    setLoading(true);
    try {
      const response = await gettingResponse({
        body,
        currentText: value,
      }).unwrap();
      console.log("direct response from api", response);
      // const filteredResponse = filterResponse(response);
      const filteredResponse = response[2];
      console.log("API filtered response:", filteredResponse);
      // console.log("API returned response:", response);
      return filteredResponse; // Return the response to the caller
    } catch (error) {
      console.error("Error calling API:", error);
      throw error; // Propagate the error to be handled by the caller
    } finally {
      setLoading(false);
    }
  };

  const [input, setInput] = useState({
    question: "",
    context: "",
  });
  // console.log(messagesT, "chat message done.");
  // const [messages, setMessages] = useState<MessageType[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatHistoryEntry[]>([]); // Chat history with correct type
  const [isTyping, setIsTyping] = useState(false); // State to manage typing indicator
  // Retrieve chat history from session storage
  const getStoredContext = () => {
    const storedContext = sessionStorage.getItem("context");
    return storedContext ? JSON.parse(storedContext) : [];
  };

  const getFormattedTime = () => {
    const date = new Date();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const isPM = hours >= 12;

    // Convert to 12-hour format
    hours = hours % 12 || 12;

    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${hours}:${formattedMinutes} ${isPM ? "PM" : "AM"}`;
  };

  const handleSend = async (value: string) => {
    // sendMessage();
    console.log(value, "testing value done");
    if (value.trim()) {
      const currentTime = getFormattedTime();
      console.log(currentTime, "time is ");
      // Add the outgoing message to the message list

      const msgText = value
        ?.replaceAll("&nbsp;", " ")
        .replaceAll("<br>", "\n")
        ?.trim();
      console.log({ msgText, value });

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          message: msgText,
          sentTime: currentTime,
          sender: "user",
          direction: "outgoing",
          position: "single",
        },
      ]);
      // console.log(messages, "messages checking");
      setInput({
        ...input,
        question: "",
      });
      const newQuestion: ChatHistoryEntry = {
        question: msgText,
        answer: "", // Initialize with an empty answer
        sentTime: currentTime,
      };

      // setIsTyping(true); // Show typing indicator

      try {
        console.log("qdwe", input.question);
        console.log(messages, "messages checking");
        console.log(input, "input checking");
        const response = await sendMessage(messages, msgText);
        console.log(response, "checking response22 22");

        newQuestion.answer = response.message;

        // Add the incoming message (response from server) to the message list
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            message: response.message, // Assuming the response contains an 'answer' field
            sentTime: getFormattedTime(),
            sender: "Support",
            direction: "incoming",
            position: "single",
          },
        ]);

        // Update chat history with both question and answer
        setChatHistory((prevChatHistory) => [...prevChatHistory, newQuestion]);
      } catch (error) {
        console.error("Error sending message:", error);

        newQuestion.answer =
          "There was an error processing your request. Please try again.";

        // Optionally, add an error message to the message list
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            message:
              "There was an error processing your request. Please try again.",
            sentTime: getFormattedTime(),
            sender: "Support",
            direction: "incoming",
            position: "single",
          },
        ]);

        setChatHistory((prevChatHistory) => [...prevChatHistory, newQuestion]);
      } finally {
        setIsTyping(false); // Hide typing indicator after response or error
      }
    }
  };

  // Function to minimize the chat
  const handleMinimizeChat = () => {
    sessionStorage.removeItem("context");
    sessionStorage.setItem("context", JSON.stringify(messages));
    setShow(false);
  };

  // Function to close and store chat
  const handleCloseChat = () => {
    sessionStorage.removeItem("context");
    // Reset the messages and chat history
    setMessages([]);
    // console.log({ messages }, "on close");
    setShow(false);
  };

  const handleClearChat = () => {
    sessionStorage.removeItem("context");
    // Reset the messages and chat history
    setMessages([]);
  };

  return (
    show && (
      <div className="chatbot-main">
        <ChatHeader
          onClearChat={handleClearChat}
          onMinimizeChat={handleMinimizeChat}
          onCloseChat={handleCloseChat}
        />
        <div className="bg-red">
          <MainContainer>
            <ChatContainer>
              {/* <MessageHeader messages={messages} setShow={setShow} setMessages={setMessages as React.Dispatch<React.SetStateAction<MessageType[]>>} /> */}

              {messages.length > 0 && (
                <ConversationHeader>
                  <ConversationHeader.Content
                    // info="Active Now"
                    userName="Ask Queries"
                  />
                </ConversationHeader>
              )}
              {messages.length === 0 && (
                <ConversationHeader>
                  <ConversationHeader.Content
                    // info="Active Now"
                    userName="Ask Queries"
                  />
                </ConversationHeader>
              )}

              <MessageList
              // typingIndicator={
              //   isTyping && <TypingIndicator content="Chatbot is typing..." />
              // }
              >
                {/* {<HeroText />} */}
                {messages.length === 0 && <HeroText />}
                {/* {messages?.length > 0 && <MessageSeparator content={date} />} */}
                {messages.map((msg, index) => {
                  return (
                    <>
                      <div
                        key={index}
                        className={` flex items-center ${msg.direction === "incoming" ? `incoming-message-wrappekkr` : ``}`}
                      >
                        {/* {msg.direction === "incoming" && (
                      <>
                        <Avatar
                          name="Zoe"
                          src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
                        />
                      </>
                    )} */}
                        <Message
                          model={{
                            direction: msg.direction, // Adjust direction as needed
                            // message: msg.message,
                            position: msg.position,
                            // sender: msg.sender,
                            // sentTime: "2024-11-08T11:10:36.518Z",
                          }}
                        >
                          <Message.CustomContent>
                            {msg.message}
                            {/* <div>wkn</div> */}
                            {/* <div>{msg.message}</div> */}
                            <div className="text-gray-500 text-xs p-0 flex items-center justify-end">
                              {msg.sentTime}
                            </div>
                          </Message.CustomContent>
                        </Message>
                        {/* {msg.direction === "outgoing" && (
                      <Avatar
                        name="Zoe"
                        src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
                      />
                    )} */}
                      </div>
                      {index === messages.length - 1 && loading ? (
                        <div className=" h-[75px] flex">
                          <SpinnerInfinity
                            className=" m-auto"
                            thickness={150}
                            size={64}
                          />
                        </div>
                      ) : null}
                    </>
                  );
                })}
              </MessageList>

              {/* <ChatMessagesList messages={messages} loading={loading}/> */}

              <MessageInput
                placeholder="Write a message"
                value={input.question}
                onChange={(value) =>
                  setInput({
                    ...input,
                    question: value,
                  })
                }
                onPaste={(evt) => {
                  evt.preventDefault();
                  console.log(
                    "heyey",
                    evt.clipboardData
                      .getData("text")
                      ?.replaceAll(" ", "&nbsp;"),
                  );
                  setInput({
                    ...input,
                    question: evt.clipboardData
                      .getData("text")
                      ?.replaceAll(" ", "&nbsp;"),
                  });
                }}
                onSend={handleSend} // Handles message sending
                // sendButton
                // sendButton={false}
              />

              {/* </div> */}
            </ChatContainer>
          </MainContainer>
        </div>
        {/* </div> */}
      </div>
    )
  );
};

export default ChatMessageComponent;
