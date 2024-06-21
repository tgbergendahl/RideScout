import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyD7fPS88Qiq5Q_jboSPJty21h605HZ33Nw",
  authDomain: "ridescout-911a8.firebaseapp.com",
  projectId: "ridescout-911a8",
  storageBucket: "ridescout-911a8.appspot.com",
  messagingSenderId: "701647917174",
  appId: "1:701647917174:web:46fec9b6dbc0cbc91a8f57"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { db, auth };
