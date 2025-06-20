// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCOkpWjywHODPuBXwUlmHzpSxt8VGXiKx8",
    authDomain: "windeals-e28e4.firebaseapp.com",
    databaseURL: "https://windeals-e28e4-default-rtdb.firebaseio.com",
    projectId: "windeals-e28e4",
    storageBucket: "windeals-e28e4.appspot.com",
    messagingSenderId: "455300835570",
    appId: "1:455300835570:android:09d26fbacb2e4aa945486b",
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Services
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);

export { auth, database, storage };
