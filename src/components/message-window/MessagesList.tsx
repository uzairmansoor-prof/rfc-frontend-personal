// import ConversationHeader from "@heropana/chat-ui-kit-react/src/components/ConversationHeader/ConversationHeader";
import { ConversationHeader } from "@heropana/chat-ui-kit-react";
import React from "react";
import "./style.scss";
import { Popconfirm, Tooltip } from "antd";
import {
  ChatbotCloseSvg,
  ChatbotMinimizeSvg,
  ResetIconSvg,
} from "@/assets/img/icons";

interface MessageArrayItem {
  direction: "outgoing" | "incoming";
  message: string;
  position: string;
  sender: string;
  sentTime: string;
}
interface MessageHeaderProps {
  messages: MessageArrayItem[]; // Update type if needed
  setShow: (value: boolean | ((prevStat: boolean) => boolean)) => void;
  setMessages: React.Dispatch<React.SetStateAction<MessageArrayItem[]>>;
}
const MessageHeader = ({
  messages,
  setShow,
  setMessages,
}: MessageHeaderProps) => {
  const handleMinimizeChat = () => {
    setShow(false);
  };
  const handleClearChat = () => {
    sessionStorage.removeItem("context");
    // Reset the messages and chat history
    setMessages([]);
  };

  // Function to close and store chat
  const handleCloseChat = () => {
    sessionStorage.removeItem("context");
    // Reset the messages and chat history
    setMessages([]);
    // console.log({ messages }, "on close");
    setShow(false);
  };
  return (
    <>
      {messages?.length > 0 && (
        <div className="chat-header-btn">
          <Tooltip title="Clear Chat">
            <span onClick={handleClearChat} className="mr-2 [&_svg]:h-[16px]">
              <ResetIconSvg />
            </span>
          </Tooltip>
          <Tooltip title="Minimize Chat">
            {/* <MinusOutlined onClick={handleMinimizeChat} className="mr-2" />ChatbotMinimizeSvg */}
            <span onClick={handleMinimizeChat} className="mr-2">
              <ChatbotMinimizeSvg />
            </span>
          </Tooltip>
          {/* Add Popconfirm for the close button */}
          <Popconfirm
            title="Are you sure you want to close the chat?"
            onConfirm={handleCloseChat} // Close chat if confirmed
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Close Chat">
              {/* <CloseOutlined /> */}
              <span className="mr-2">
                <ChatbotCloseSvg />
              </span>
            </Tooltip>
          </Popconfirm>
        </div>
      )}
      {/* {messages?.length === 0 && ( */}
      <div className="chat-header-btn">
        <Tooltip title="Minimize Chat">
          {/* <MinusOutlined onClick={handleMinimizeChat} className="mr-2" />ChatbotMinimizeSvg */}
          <span onClick={handleMinimizeChat} className="mr-2">
            <ChatbotMinimizeSvg />
          </span>
        </Tooltip>
        {/* Add Popconfirm for the close button */}
        <Tooltip title="Close Chat">
          {/* <CloseOutlined /> */}
          <span onClick={handleCloseChat} className="mr-2">
            <ChatbotCloseSvg />
          </span>
        </Tooltip>
      </div>
      {messages.length > 0 && (
        <ConversationHeader>
          <ConversationHeader.Content
            // info="Active Now"
            userName="Ask Queries"
          />
        </ConversationHeader>
      )}
      {/* <div> */}
      {messages.length === 0 && (
        <ConversationHeader>
          <ConversationHeader.Content
            // info="Active Now"
            userName="Ask Queries"
          />
        </ConversationHeader>
      )}
      ;
    </>
  );
};

export default MessageHeader;
