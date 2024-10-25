import { useStateProvider } from "@/context/StateContext";
import React, { useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import { ImAttachment } from "react-icons/im";
import { MdSend } from "react-icons/md";
import axios from "axios";
import { ADD_MESSAGE_ROUTE } from "@/utils/ApiRoutes";

function MessageBar() {
  const [{ userInfo, currentChatUser }, dispatch] = useStateProvider();
  const [message, setMessage] = useState("");
  console.log("Current Chat User: ", currentChatUser);
  console.log("Current User: ", userInfo);

  const sendMessageHandler = async () => {
    if (!message.trim()) return;
    console.log("Sending message:", message);

    try {
      const { data } = await axios.post(
        ADD_MESSAGE_ROUTE,
        {
          to: currentChatUser?.id,
          from: userInfo?.id,
          message,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Message sent successfully:", data);
      setMessage(""); // Clear the input field after sending
    } catch (error) {
      console.log("Error while processing message request:", error);
    }
  };

  return (
    <div className="bg-panel-header-background h-20 px-4 flex items-center gap-6 z-50">
      <div className="flex gap-6">
        <BsEmojiSmile
          className="text-panel-header-icon cursor-pointer text-xl"
          title="Emoji"
          style={{ pointerEvents: "auto", zIndex: 30 }} // Ensure clickability
        />
        <ImAttachment
          className="text-panel-header-icon cursor-pointer text-xl"
          title="Attach File"
          style={{ pointerEvents: "auto", zIndex: 30 }}
        />
      </div>

      <div className="w-full rounded-lg h-10 flex items-center">
        <input
          type="text"
          name="message"
          placeholder="Type a message"
          className="bg-input-background text-sm focus:outline-none text-white h-10 rounded-lg px-4 py-2 w-full"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <div className="flex w-10 items-center justify-center">
        <button onClick={sendMessageHandler} type="submit">
          <MdSend
            className="text-panel-header-icon cursor-pointer text-xl"
            title="Send message"
            style={{ pointerEvents: "auto", zIndex: 30 }}
          />
        </button>
      </div>
    </div>
  );
}

export default MessageBar;
