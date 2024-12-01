// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC4uhcRXanPo-qo0XUdCJIYRyslmmxSjpw",
  authDomain: "notion-ai-clone-3023f.firebaseapp.com",
  projectId: "notion-ai-clone-3023f",
  storageBucket: "notion-ai-clone-3023f.firebasestorage.app",
  messagingSenderId: "683991721396",
  appId: "1:683991721396:web:821207fce4eee7fbed7ee1"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export { db };