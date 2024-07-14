import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, initializeAuth, getReactNativePersistence, indexedDBLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyD7fPS88Qiq5Q_jboSPJty21h605HZ33Nw",
  authDomain: "ridescout-911a8.firebaseapp.com",
  projectId: "ridescout-911a8",
  storageBucket: "ridescout-911a8.appspot.com",
  messagingSenderId: "701647917174",
  appId: "1:701647917174:web:46fec9b6dbc0cbc91a8f57"
};

let app;
let db;
let auth;
let storage;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);

  if (typeof window !== 'undefined') {
    auth = getAuth(app);
    auth.setPersistence(indexedDBLocalPersistence);  // or browserSessionPersistence
  } else {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  }

  storage = getStorage(app);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

export { db, auth, storage };
