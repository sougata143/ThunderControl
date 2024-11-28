import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import Constants from 'expo-constants';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAqrPCEA-T1o9khUJ9xTGKOVZ9wqMA37xk",
  authDomain: "thundercontrol-8d40f.firebaseapp.com",
  projectId: "thundercontrol-8d40f",
  storageBucket: "thundercontrol-8d40f.firebasestorage.app",
  messagingSenderId: "347105322813",
  appId: "1:347105322813:web:61bdb9af2c3134cfd28754",
  measurementId: "G-KYETXR84GM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;
