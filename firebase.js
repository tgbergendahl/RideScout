// firebase.js
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyD7fPS88Qiq5Q_jboSPJty21h605HZ33Nw',
  authDomain: 'ridescout-911a8.firebaseapp.com',
  projectId: 'ridescout-911a8',
  storageBucket: 'ridescout-911a8.appspot.com',
  messagingSenderId: '701647917174',
  appId: '1:701647917174:web:46fec9b6dbc0cbc91a8f57',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Storage
const storage = getStorage(app);

export { auth, db, storage };
