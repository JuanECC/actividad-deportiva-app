// src/services/firebase.js
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyA7zsr2md6WTKSEdPRTPv4G9Cs29aQFNZA",
  authDomain: "actividad-deportiva.firebaseapp.com",
  projectId: "actividad-deportiva",
  storageBucket: "actividad-deportiva.firebasestorage.app",
  messagingSenderId: "198925659899",
  appId: "1:198925659899:web:66eb0d22a1ffcce49b8a5e"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Auth
export const auth = getAuth(app)

// Initialize Firestore
export const db = getFirestore(app)