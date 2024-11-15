import { MessageType } from "@/assets/contracts/message";
import { MsgIconSVG } from "@/assets/img/icons";
import ChatMessageComponent from "@/components/message-window/ChatMessageComponent";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";

interface Props {
  title: string;
  children: React.ReactNode;
  className?: string;
  rightLayout?: React.ReactNode;
}

const AdminLayoutContentWrapper = ({
  title,
  rightLayout = undefined,
  children,
  className = ``,
}: Props) => {
  const [isShow, setIsShow] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const getStoredContext = () => {
    const storedContext = sessionStorage.getItem("context");
    return storedContext ? JSON.parse(storedContext) : [];
  };
  // setMessages(getStoredContext());

  const location = useLocation();
  return (
    <section className={`overflow-hidden px-8 h-full  ${className}`}>
      <div className={`flex justify-between items-center ${title && "mb-4"}`}>
        <div className="text-primary  text-base font-semibold ">{title}</div>
        {rightLayout}
      </div>

      <div className="content-wrapper h-[100%] w-[100%]">
        {!location?.pathname.includes("manage-sheet") && (
          <>
            {" "}
            <div
              className="toggle-btn absolute bottom-16 right-20 cursor-pointer z-[990]"
              onClick={() => {
                setIsShow(!isShow);
                setMessages(getStoredContext());
              }}
            >
              <div className="relative">
                <span className="absolute top-0 right-0 font-semibold  bg-secondary-dark text-primary text-sm cursor-default border border-primary rounded-[5px] py-2 px-3 w-[100px] h-[35px] text-center shadow-lg">
                  Ask Away
                </span>
                <span className="absolute top-[-11px] right-[-52px] flex h-[60px]  w-[60px] [&_svg]:h-[65%]  rounded-full bg-primary [&_svg]:m-auto  [&_svg]:fill-white shadow-[0px_3.34px_3.34px_0px_rgba(0,0,0,0.25)]  ">
                  <MsgIconSVG />
                </span>
              </div>
            </div>
            <div className="chatbot-wrapper">
              <ChatMessageComponent
                show={isShow}
                setShow={setIsShow}
                messages={messages}
                setMessages={setMessages}
                // messagesT={filteredMessages}
              />
            </div>
          </>
        )}
        {children}
      </div>
    </section>
  );
};

export default AdminLayoutContentWrapper;
