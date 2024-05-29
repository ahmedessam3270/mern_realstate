// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-realstate-6f52e.firebaseapp.com",
  projectId: "mern-realstate-6f52e",
  storageBucket: "mern-realstate-6f52e.appspot.com",
  messagingSenderId: "944426622195",
  appId: "1:944426622195:web:fd4a98551bd8072c1c6b86",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
