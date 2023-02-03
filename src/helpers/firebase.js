// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// import {getAuth} from 'firebase/auth';
// import {getDatabase} from 'firebase/database';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBbwlRdy12joxy0zqM02ndbLAGDUsRDGCw",
  authDomain: "skin-monitoring-app.firebaseapp.com",
  projectId: "skin-monitoring-app",
  storageBucket: "skin-monitoring-app.appspot.com",
  messagingSenderId: "602636451978",
  appId: "1:602636451978:web:4ea1c20c0ad7c968bced73",
  databaseURL: "https://skin-monitoring-app-default-rtdb.firebaseio.com"
};

// let app;
// if (firebase.apps.length == 0) {
//     app = initializeApp(firebaseConfig);
// } else {
//     app = firebase.app();
// }

const app = initializeApp(firebaseConfig);

// const auth = getAuth(app);
// const database = getDatabase(app);

export default app;