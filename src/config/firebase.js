import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDTCw153TnKVVCTqpGhk0Sctbyeq-oy7gQ",
  authDomain: "herstory-forum-app-dev.firebaseapp.com",
  databaseURL: "https://herstory-forum-app-dev-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "herstory-forum-app-dev",
  storageBucket: "herstory-forum-app-dev.appspot.com",
  messagingSenderId: "127971481183",
  appId: "1:127971481183:web:af06934f43056d51e0edea",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage();
export default app;