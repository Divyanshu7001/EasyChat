import React, { useEffect, useState } from "react";
import ChatList from "./Chatlist/ChatList";
import Empty from "./Empty";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import { useStateProvider } from "@/context/StateContext";
import axios from "axios";
import { CHECK_USER_ROUTE, GET_MESSAGES } from "@/utils/ApiRoutes";
import { useRouter } from "next/router";
import { reducerCases } from "@/context/constants";
import Chat from "./Chat/Chat";
function Main() {
  const router = useRouter();
  const [redirectLogin, setRedirectLogin] = useState(false);
  const [{ userInfo, currentChatUser, newUser }] = useStateProvider();
  const [{}, dispatch] = useStateProvider();

  useEffect(() => {
    if (redirectLogin) {
      router.push("/login");
    }
  }, [redirectLogin]);

  onAuthStateChanged(firebaseAuth, async (currentUser) => {
    if (!currentUser) {
      setRedirectLogin(true);
    }
    if (!userInfo && currentUser?.email) {
      const { data } = await axios.post(
        CHECK_USER_ROUTE,
        { email: currentUser.email },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!data.status) {
        router.push("/login");
      }
      const {
        id,
        email,
        name,
        profilePicture: profileImage,
        about: status,
      } = data.user;
      dispatch({
        type: reducerCases.SET_USER_INFO,
        userInfo: {
          id,
          name,
          email,
          profileImage,
          status,
        },
      });
      router.push("/");
    }
  });

  useEffect(() => {
    const getMessages = async () => {
      const { data } = await axios.get(
        `${GET_MESSAGES}/${userInfo.id}/${currentChatUser.id}`,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      const messages = data.messages;
      console.log(messages);
      
      dispatch({
        type: reducerCases.SET_MESSAGES,
        messages,
      });
    };

    if (currentChatUser?.id) {
      const timer = setTimeout(() => {
        getMessages();
      }, 2000); // Delay for 2 seconds

      // Cleanup: Clear the timeout if the component unmounts
      return () => clearTimeout(timer);
    }
  }, [currentChatUser]);

  return (
    <>
      <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full over ">
        <ChatList />
        {currentChatUser ? <Chat /> : <Empty />}
        <Chat />
      </div>
    </>
  );
}

export default Main;
