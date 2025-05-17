import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCN9muHegWkmA4-o010Dzu06Z_J9c0g2V4",
  authDomain: "login-with-983eb.firebaseapp.com",
  projectId: "login-with-983eb",
  storageBucket: "login-with-983eb.firebasestorage.app",
  messagingSenderId: "120677961488",
  appId: "1:120677961488:web:18d0dd8e648d2fd152df95"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();