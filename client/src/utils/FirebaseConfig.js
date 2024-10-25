import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAy9CIJ9a6wNmL3c4Ji1CykzSGgkWx9Upk",

  authDomain: "easychat-56c6f.firebaseapp.com",

  projectId: "easychat-56c6f",

  storageBucket: "easychat-56c6f.appspot.com",

  messagingSenderId: "722697908959",

  appId: "1:722697908959:web:717d971b416ca5ad526f6a",

  measurementId: "G-302BS36LL1",
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
