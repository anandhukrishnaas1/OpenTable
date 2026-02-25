import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  User
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "opentable01.firebaseapp.com",
  databaseURL: "https://opentable01-default-rtdb.firebaseio.com",
  projectId: "opentable01",
  storageBucket: "opentable01.firebasestorage.app",
  messagingSenderId: "793476493352",
  appId: "1:793476493352:web:c41e88de658eab0a8f451d",
  measurementId: "G-Z0Q67EDC71"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if user exists in Firestore, if not create them
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      await setDoc(userDocRef, {
        uid: user.uid,
        name: user.displayName || "Unknown",
        email: user.email,
        phone: user.phoneNumber || "",
        role: 'user', // Default role
        createdAt: new Date()
      });
    }

    return user;
  } catch (error) {
    console.error("Google Sign In Error:", error);
    throw error;
  }
};

export const registerWithEmail = async (email: string, pass: string, name: string, phone: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;

    // Update the user's display name
    await updateProfile(user, { displayName: name });

    // Store extra details (phone) in Firestore since Auth doesn't store phone by default for email users
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: name,
      email: email,
      phone: phone,
      role: 'user', // Default role
      createdAt: new Date()
    });

    return user;
  } catch (error) {
    console.error("Registration Error:", error);
    throw error;
  }
};

export const loginWithEmail = async (email: string, pass: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    return result.user;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

export const logout = () => signOut(auth);

// Helper for donation saving
export const saveDonationToCloud = async (data: any) => {
  try {
    const donationRef = doc(db, "donations", data.id || Math.random().toString(36));
    await setDoc(donationRef, {
      ...data,
      uploadedAt: new Date()
    });
    console.log("Document written with ID: ", donationRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};