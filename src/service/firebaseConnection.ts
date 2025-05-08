import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_APIKEY_FIREBASE,
  authDomain: process.env.NEXT_PUBLIC_AUTHDOMAIN_FIREBASE,
  projectId: process.env.NEXT_PUBLIC_PROJECTID_FIREBASE,
  storageBucket: process.env.NEXT_PUBLIC_STORAGEBUCKET_FIREBASE,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGEINGSENDERID_FIREBASE,
  appId: process.env.NEXT_PUBLIC_APPID_FIREBASE
}

const firebaseApp = initializeApp(firebaseConfig)
const db = getFirestore(firebaseApp)
const auth = getAuth(firebaseApp)

export { db, auth }
