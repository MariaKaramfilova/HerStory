import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

/**
 * Firebase configuration object.
 *
 * This object contains the configuration settings required to connect your
 * application to Firebase services such as Firestore, Authentication, and Storage.
 * To obtain this configuration, you need to create a project in the Firebase
 * Console and retrieve the configuration settings from there.
 *
 * @type {object}
 * @property {string} apiKey - The API key for your Firebase project.
 * @property {string} authDomain - The authentication domain for your Firebase project.
 * @property {string} databaseURL - The Firebase Realtime Database URL for your project.
 * @property {string} projectId - The ID of your Firebase project.
 * @property {string} storageBucket - The storage bucket URL for your Firebase project.
 * @property {string} messagingSenderId - The messaging sender ID for your Firebase project.
 * @property {string} appId - The app ID for your Firebase project.
 *
 * @see {@link https://firebase.google.com/docs/web/setup#config-object | Firebase Configuration Object}
 */

const firebaseConfig = {
  apiKey: "AIzaSyDTCw153TnKVVCTqpGhk0Sctbyeq-oy7gQ",
  authDomain: "herstory-forum-app-dev.firebaseapp.com",
  databaseURL:
    "https://herstory-forum-app-dev-default-rtdb.europe-west1.firebasedatabase.app",
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
