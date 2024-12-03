// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8BCiCKbrgKDoDh9zc-9rFmjoFvh1ZBTM",
  authDomain: "crossplatformsessions.firebaseapp.com",
  projectId: "crossplatformsessions",
  storageBucket: "crossplatformsessions.firebasestorage.app",
  messagingSenderId: "335270794908",
  appId: "1:335270794908:web:346759c48babfff3823f59"
};



// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const db = getFirestore(FIREBASE_APP)
