import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCDw-I_nQtagrreqBlmrhJa3DDIhSsFuhY",
    authDomain: "onlyf-4aa06.firebaseapp.com",
    projectId: "onlyf-4aa06",
    storageBucket: "onlyf-4aa06.firebasestorage.app",
    messagingSenderId: "688538499350",
    appId: "1:688538499350:web:a56e6178fb93d336c93837",
    measurementId: "G-NFM4YV1140"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };