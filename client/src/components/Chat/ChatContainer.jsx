import { useStateProvider } from "@/context/StateContext";
import { calculateTime } from "@/utils/CalculateTime";
import React from "react";
import MessageStatus from "../common/MessageStatus";
import ImageMessage from "./ImageMessage";

function ChatContainer() {
  const [{ messages, userInfo, currentChatUser }] = useStateProvider();
  console.log("messages in Container: ", messages);

  return (
    <div className="h-[80vh] w-full relative flex-grow overflow-scroll overflow-x-hidden custom-scrollbar">
      <div className="relative bg-chat-background bg-fixed left-0 -z-10">
        <div className="absolute inset-0 bg-black bg-opacity-60 z-0"></div>
        <div className="flex w-full z-10">
          <div className="flex flex-col justify-end w-full gap-1 overflow-auto z-20">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderId === currentChatUser.id
                    ? "justify-start ml-0.5"
                    : "justify-end mr-0.5"
                }`}
              >
                {message.type === "text" && (
                  <div
                    className={`px-2 py-[5px] text-sm rounded-md flex gap-2 items-end max-w-[45%] ${
                      message.senderId === currentChatUser.id
                        ? "bg-incoming-background"
                        : "bg-outgoing-background"
                    }`}
                  >
                    <span className="font-mono text-white">
                      {message.message}
                    </span>
                    <div className="flex gap-1 items-end">
                      <span className="text-bubble-meta text-[11px] pt-1 min-w-fit">
                        {calculateTime(message.createdAt)}
                      </span>
                      <span>
                        {message.senderId === userInfo.id && (
                          <MessageStatus
                            MessageStatus={message.messageStatus}
                          />
                        )}
                      </span>
                    </div>
                  </div>
                )}
                {
                  message.type==="image" && <ImageMessage message={message}/>
                }
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatContainer;
