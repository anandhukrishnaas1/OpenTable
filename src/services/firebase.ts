import { initializeApp } from "firebase/app";
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
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
apiKey: import.meta.env.VITE_FIREBASE_API_KEY,  authDomain: "freshlink1-88357.firebaseapp.com",
  projectId: "freshlink1-88357",
  storageBucket: "freshlink1-88357.firebasestorage.app",
  messagingSenderId: "987793950140",
  appId: "1:987793950140:web:d5369e884e5c25c55817b9",
  measurementId: "G-FB5EG3W782"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
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