import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';

// Real Firebase Configuration for Keetcode Visualizer
const firebaseConfig = {
  apiKey: "AIzaSyBWkt1i7myDlUva_VTxIfXX9h1UNVNLbMI",
  authDomain: "keetcode-visualiser.firebaseapp.com",
  projectId: "keetcode-visualiser",
  storageBucket: "keetcode-visualiser.firebasestorage.app",
  messagingSenderId: "667653861444",
  appId: "1:667653861444:web:0e98f2596d638bd8a28c11",
  measurementId: "G-NFEMMDW6J7"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Real Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Optional: Prompt account selection every time
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export {
  signInWithPopup,
  signOut,
  onAuthStateChanged
};
