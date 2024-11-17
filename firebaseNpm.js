// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-OM0Riuj2Wr7md4Bu3hAuTMdrglMsn44",
  authDomain: "register-and-login-b2644.firebaseapp.com",
  databaseURL: "https://register-and-login-b2644-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "register-and-login-b2644",
  storageBucket: "register-and-login-b2644.firebasestorage.app",
  messagingSenderId: "674830780279",
  appId: "1:674830780279:web:01eec023d5d6461c184372"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);