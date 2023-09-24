// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBtc5agWyNqsAmURa_9RlUJJRJD17SlZD8",
  authDomain: "chat-app-cf39a.firebaseapp.com",
  projectId: "chat-app-cf39a",
  storageBucket: "chat-app-cf39a.appspot.com",
  messagingSenderId: "1029588687893",
  appId: "1:1029588687893:web:3aaf5e5322a0ec133d821c",
  measurementId: "G-XLDV3W0Q1E",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
