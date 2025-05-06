import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.APIKEY_FIREBASE,
  authDomain: process.env.AUTHDOMAIN_FIREBASE,
  projectId: process.env.PROJECTID_FIREBASE,
  storageBucket: process.env.STORAGEBUCKET_FIREBASE,
  messagingSenderId: process.env.MESSAGEINGSENDERID_FIREBASE,
  appId: process.env.APPID_FIREBASE
}

const firebaseApp = initializeApp(firebaseConfig)
const db = getFirestore(firebaseApp)
const auth = getAuth(firebaseApp)

export { db, auth }
