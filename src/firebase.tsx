// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { setPersistence, browserLocalPersistence } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBptq-5mzwhB89jR6Xqut2OwdyktRMmsrs",
  authDomain: "donationtracker-71f1e.firebaseapp.com",
  projectId: "donationtracker-71f1e",
  storageBucket: "donationtracker-71f1e.appspot.com",
  messagingSenderId: "297225966844",
  appId: "1:297225966844:web:204e9080ce764ce7f0b379",
  measurementId: "G-2EKTQYCS46",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
