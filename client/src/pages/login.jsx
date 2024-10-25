import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import axios from "axios";
import { CHECK_USER_ROUTE } from "@/utils/ApiRoutes";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
function login() {
  const router = useRouter();

  const [{}, dispatch] = useStateProvider();
  const [{ userInfo, newUser }] = useStateProvider();
  useEffect(() => {
    //console.log(userInfo, newUser);

    if (userInfo?.id && !newUser) {
      router.push("/");
    }
  }, [userInfo, newUser]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(firebaseAuth, provider);
    const { displayName: name, email, photoURL: profileImage } = user;
    // console.log(name, email);

    try {
      if (email) {
        console.log("In Checking Email");

        const { data } = await axios.post(
          CHECK_USER_ROUTE,
          { email },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );

        console.log(data);
        if (!data.status) {
          dispatch({
            type: reducerCases.SET_NEW_USER,
            newUser: true,
          });
          dispatch({
            type: reducerCases.SET_USER_INFO,
            userInfo: {
              name,
              email,
              profileImage,
              status: "",
            },
          });
          router.push("/onboarding");
        } else {
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
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex justify-center items-center bg-panel-header-background h-screen w-screen flex-col gap-6">
      <div className="flex items-center justify-center gap-2">
        <Image src={"/whatsapp.gif"} alt="EasyChat" height={300} width={300} />
        <span className="text-7xl text-white font-mono font-extrabold">
          EasyChat
        </span>
      </div>
      <button
        className="flex items-center justify-center gap-7 bg-search-input-container-background p-5 rounded-lg"
        onClick={handleLogin}
      >
        <FcGoogle className="text-4xl" />
        <span className="text-white text-2xl">Login With Google</span>
      </button>
    </div>
  );
}

export default login;
