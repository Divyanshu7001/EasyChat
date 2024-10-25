import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import "dotenv/config";
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,

  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN,

  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,

  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,

  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,

  appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,

  measurementId: process.env.NEXT_PUBLIC_FIREBAASE_MEASUREMENTID,
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
