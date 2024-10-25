import React from "react";
import Main from "@/components/Main";
import { useStateProvider } from "@/context/StateContext";

function index() {
  const [{ userInfo, newUser }] = useStateProvider();
  console.log(userInfo, newUser);

  return (
    <>
      <div>
        <Main />
      </div>
    </>
  );
}

export default index;
