// firebaseConfigNode.js
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');
const { getAuth } = require('firebase/auth');
const { getStorage } = require('firebase/storage');

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
  auth = getAuth(app);
  storage = getStorage(app);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

module.exports = { db, auth, storage };
