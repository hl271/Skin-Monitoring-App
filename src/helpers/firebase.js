// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {FIREBASE_API_KEY, FIREBASE_PROJECT_ID, FIREBASE_MESSSAGE_SENDER_ID, FIREBASE_APP_ID} from "@env"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: `${FIREBASE_API_KEY}`,
  authDomain: `${FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: `${FIREBASE_PROJECT_ID}`,
  storageBucket: `${FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: `${FIREBASE_MESSSAGE_SENDER_ID}`,
  appId: `${FIREBASE_APP_ID}`,
  storageBucket: `gs://${FIREBASE_PROJECT_ID}.appspot.com`
};

const app = initializeApp(firebaseConfig);

export default app;