import { useStateProvider } from "@/context/StateContext";
import React, { useEffect, useRef, useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import { ImAttachment } from "react-icons/im";
import { MdSend } from "react-icons/md";
import axios from "axios";
import { ADD_IMAGE_MESSAGE_ROUTE, ADD_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import { reducerCases } from "@/context/constants";
import EmojiPicker from "emoji-picker-react";
import PhotoPicker from "../common/PhotoPicker";
import CaptureAudio from "../common/CaptureAudio";

function MessageBar() {
  const [{ userInfo, currentChatUser, socket }, dispatch] = useStateProvider();
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const [grabPhoto, setGrabPhoto] = useState(false);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);

  console.log("Current Chat User: ", currentChatUser);
  console.log("Current User: ", userInfo);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.id !== "emoji-open") {
        if (
          emojiPickerRef.current &&
          !emojiPickerRef.current.contains(event.target)
        ) {
          setShowEmojiPicker(false);
        }
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  });

  useEffect(() => {
    if (grabPhoto) {
      setTimeout(() => {
        const data = document.getElementById("photo-picker");
        console.log(data);
        data.click();
      }, 100); // Add a small delay

      const handleFocus = () => setGrabPhoto(false);
      document.body.addEventListener("focus", handleFocus);

      return () => document.body.removeEventListener("focus", handleFocus);
    }
  }, [grabPhoto]);

  const photoPickerChange = async (e) => {
    const file = e.target.files[0];
    console.log(file);
    const formData = new FormData();
    formData.append("image", file);
    console.log(formData);

    const response = await axios.post(ADD_IMAGE_MESSAGE_ROUTE, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        from: userInfo.id,
        to: currentChatUser.id,
      },
    });
    console.log(response.status);
    console.log(response.data.message);

    if (response.status === 200) {
      console.log("before emit");

      socket.current.emit("send-msg", {
        to: currentChatUser?.id,
        from: userInfo?.id,
        message: response.data.message,
      });
      dispatch({
        type: reducerCases.ADD_MESSAGE,
        newMessage: {
          ...response.data.message,
        },
        fromSelf: true,
      });
    }
    // const reader = new FileReader();
    // const data = document.createElement("img");
    // reader.onload = function (event) {
    //   data.src = event.target.result;
    //   //console.log(data.src);
    //   data.setAttribute("data-src", event.target.result);
    // };
    // reader.readAsDataURL(file);
    // setTimeout(() => {
    //   setImage(data.src);
    // }, 300);
  };

  const handleEmojiModel = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (emoji) => {
    setMessage((prevMessage) => (prevMessage += emoji.emoji));
  };

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
      socket.current.emit("send-msg", {
        to: currentChatUser?.id,
        from: userInfo?.id,
        message: data.message,
      });
      dispatch({
        type: reducerCases.ADD_MESSAGE,
        newMessage: {
          ...data.message,
        },
        fromSelf: true,
      });
      setMessage(""); // Clear the input field after sending
    } catch (error) {
      console.log("Error while processing message request:", error);
    }
  };

  return (
    <div className="bg-panel-header-background h-20 px-4 flex items-center gap-6 z-50">
      {!showAudioRecorder && (
        <>
          <div className="flex gap-6">
            <BsEmojiSmile
              className="text-panel-header-icon cursor-pointer text-xl"
              title="Emoji"
              id="emoji-open"
              onClick={handleEmojiModel}
            />
            {showEmojiPicker && (
              <div className="absolute bottom-24 z-40" ref={emojiPickerRef}>
                <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
              </div>
            )}
            <ImAttachment
              onClick={() => setGrabPhoto(true)}
              className="text-panel-header-icon cursor-pointer text-xl"
              title="Attach File"
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
              {message.length ? (
                <MdSend
                  className="text-panel-header-icon cursor-pointer text-xl"
                  title="Send message"
                  style={{ pointerEvents: "auto", zIndex: 30 }}
                />
              ) : (
                <FaMicrophone
                  className="text-panel-header-icon cursor-pointer text-xl"
                  title="Record Message"
                  style={{ pointerEvents: "auto", zIndex: 30 }}
                  onClick={() => setShowAudioRecorder(true)}
                />
              )}
            </button>
          </div>
        </>
      )}

      {grabPhoto && <PhotoPicker onChange={photoPickerChange} />}
      {showAudioRecorder && <CaptureAudio hide={setShowAudioRecorder} />}
    </div>
  );
}

export default MessageBar;
