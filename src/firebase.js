// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyD5xKh-YHjt4PmFhlvlDTZzKmCBDM7nHYo",
    authDomain: "sgoguntradeapp.firebaseapp.com",
    projectId: "sgoguntradeapp",
    storageBucket: "sgoguntradeapp.appspot.com",
    messagingSenderId: "289124213163",
    appId: "1:289124213163:web:76c3b514631e08b1bf32ee"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
