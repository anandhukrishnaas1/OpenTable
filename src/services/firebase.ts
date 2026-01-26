import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set, serverTimestamp } from "firebase/database";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCYDCrY3LB-MKx90WTVeQ1vGHqfzGuc08g",
  authDomain: "freshlink1-88357.firebaseapp.com",
  projectId: "freshlink1-88357",
  storageBucket: "freshlink1-88357.firebasestorage.app",
  messagingSenderId: "987793950140",
  appId: "1:987793950140:web:d5369e884e5c25c55817b9",
  measurementId: "G-FB5EG3W782"
};
const app = initializeApp(firebaseConfig);

// Initialize Services
export const db = getDatabase(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Auth Helpers
export const signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (error) {
    console.error("Error signing in", error);
  }
};

export const logout = () => signOut(auth);

// Database Helper
export const saveDonationToCloud = async (data: any) => {
  try {
    const donationsRef = ref(db, 'donations');
    const newDonationRef = push(donationsRef);
    
    await set(newDonationRef, {
      ...data,
      createdAt: serverTimestamp(),
      status: "available"
    });
    
    return newDonationRef.key;
  } catch (e) {
    console.error("Error saving data: ", e);
    throw e;
  }
};