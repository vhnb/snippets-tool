import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBLUPdYQ6RiWbH8szw7YbmCiioVvfDGbC4",
  authDomain: "snippetsdatabase-b7b44.firebaseapp.com",
  projectId: "snippetsdatabase-b7b44",
  storageBucket: "snippetsdatabase-b7b44.firebasestorage.app",
  messagingSenderId: "367715969584",
  appId: "1:367715969584:web:9a1c892dfb131efc4fdbf5"
}

const firebaseApp = initializeApp(firebaseConfig)
const db = getFirestore(firebaseApp)
const auth = getAuth(firebaseApp)

export { db, auth }