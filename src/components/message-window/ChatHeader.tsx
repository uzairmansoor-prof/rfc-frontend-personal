// ChatHeader.tsx
import React from "react";
import {
  ChatbotMinimizeSvg,
  ChatbotCloseSvg,
  ResetIconSvg,
} from "@/assets/img/icons";

interface Props {
  onClearChat: () => void;
  onMinimizeChat: () => void;
  onCloseChat: () => void;
}

const ChatHeader: React.FC<Props> = ({
  onClearChat,
  onMinimizeChat,
  onCloseChat,
}) => {
  return (
    <div className="chat-header-btn">
      <span onClick={onClearChat} className="mr-2 [&_svg]:h-[16px]">
        <ResetIconSvg />
      </span>
      <span onClick={onMinimizeChat} className="mr-2">
        <ChatbotMinimizeSvg />
      </span>
      <span onClick={onCloseChat} className="mr-2">
        <ChatbotCloseSvg />
      </span>
    </div>
  );
};

export default ChatHeader;
