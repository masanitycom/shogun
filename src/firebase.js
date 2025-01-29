// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    // あなたのFirebase設定をここに入れてください
    apiKey: process.env.AIzaSyBFgdUh5fJvBmqjdwvYOSkc1dj_WfvpKU4,
    authDomain: process.env.sgoguntradeapp.firebaseapp.com,
    projectId: process.env.sgoguntradeapp,
    storageBucket: process.env.sgoguntradeapp.firebasestorage.app,
    messagingSenderId: process.env.289124213163,
    appId: process.env.1: 289124213163: web: 76c3b514631e08b1bf32ee
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
