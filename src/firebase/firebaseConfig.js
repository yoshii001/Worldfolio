import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyB-WJptcus3snX6u4_KdcdBvXqGoaIkczs",
  authDomain: "worldfolio.firebaseapp.com",
  databaseURL: "https://worldfolio-default-rtdb.firebaseio.com",
  projectId: "worldfolio",
  storageBucket: "worldfolio.firebasestorage.app",
  messagingSenderId: "1001077570001",
  appId: "1:1001077570001:web:ac6b83550ffa277d4888f0",
  measurementId: "G-YWXW5QK9WH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);

export default app;