// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBqOCA1XyFTXVDeyg0Tf1kZL_O6CXhspvg",
  authDomain: "it-sysarch32-store-dioso.firebaseapp.com",
  projectId: "it-sysarch32-store-dioso",
  storageBucket: "it-sysarch32-store-dioso.appspot.com",
  messagingSenderId: "920779593931",
  appId: "1:920779593931:web:503a26bc940055e8c2e34e",
  measurementId: "G-T9HQ7NCKM2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);

export const storage = getStorage(app);