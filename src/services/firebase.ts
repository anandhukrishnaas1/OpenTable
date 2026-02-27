/**
 * Firebase service initialization and authentication helpers.
 *
 * Configures Firebase App, Auth, Firestore, and Analytics.
 * Provides authentication methods (Google OAuth, Email/Password)
 * and Firestore document helpers.
 *
 * @module services/firebase
 */

import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

import type { Donation } from '../types';
import { env } from '../config';
import { COLLECTIONS, USER_ROLES } from '../constants';

/**
 * Firebase project configuration.
 * API key is loaded from environment variables; other values are project-specific.
 */
const firebaseConfig = {
  apiKey: env.FIREBASE_API_KEY,
  authDomain: 'opentable01.firebaseapp.com',
  databaseURL: 'https://opentable01-default-rtdb.firebaseio.com',
  projectId: 'opentable01',
  storageBucket: 'opentable01.firebasestorage.app',
  messagingSenderId: '793476493352',
  appId: '1:793476493352:web:c41e88de658eab0a8f451d',
  measurementId: 'G-Z0Q67EDC71',
};

/** Initialized Firebase application instance */
const app = initializeApp(firebaseConfig);

/** Firebase Analytics instance */
export const analytics = getAnalytics(app);

/** Firebase Auth instance */
export const auth = getAuth(app);

/** Firestore database instance */
export const db = getFirestore(app);

/** Google OAuth provider for sign-in */
const googleProvider = new GoogleAuthProvider();

/**
 * Signs in a user with Google OAuth popup.
 *
 * Creates a new user document in Firestore if the user doesn't exist yet,
 * with default role set to 'user'.
 *
 * @returns {Promise<import('firebase/auth').User>} The authenticated Firebase user
 * @throws {Error} If Google sign-in fails
 */
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if user exists in Firestore, if not create them
    const userDocRef = doc(db, COLLECTIONS.USERS, user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      await setDoc(userDocRef, {
        uid: user.uid,
        name: user.displayName || 'Unknown',
        email: user.email,
        phone: user.phoneNumber || '',
        role: USER_ROLES.USER,
        createdAt: new Date(),
      });
    }

    return user;
  } catch (error) {
    console.error('Google Sign In Error:', error);
    throw error;
  }
};

/**
 * Registers a new user with email and password.
 *
 * Creates the Firebase Auth account, sets the display name,
 * and stores the user profile in Firestore.
 *
 * @param {string} email - User's email address
 * @param {string} pass - User's password
 * @param {string} name - User's display name
 * @param {string} phone - User's phone number
 * @returns {Promise<import('firebase/auth').User>} The newly created Firebase user
 * @throws {Error} If registration fails
 */
export const registerWithEmail = async (
  email: string,
  pass: string,
  name: string,
  phone: string
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;

    // Update the user's display name
    await updateProfile(user, { displayName: name });

    // Store extra details in Firestore (Auth doesn't store phone for email users)
    await setDoc(doc(db, COLLECTIONS.USERS, user.uid), {
      uid: user.uid,
      name,
      email,
      phone,
      role: USER_ROLES.USER,
      createdAt: new Date(),
    });

    return user;
  } catch (error) {
    console.error('Registration Error:', error);
    throw error;
  }
};

/**
 * Signs in an existing user with email and password.
 *
 * @param {string} email - User's email address
 * @param {string} pass - User's password
 * @returns {Promise<import('firebase/auth').User>} The authenticated Firebase user
 * @throws {Error} If login fails
 */
export const loginWithEmail = async (email: string, pass: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    return result.user;
  } catch (error) {
    console.error('Login Error:', error);
    throw error;
  }
};

/**
 * Signs out the currently authenticated user.
 *
 * @returns {Promise<void>}
 */
export const logout = () => signOut(auth);

/**
 * Saves a donation document to Firestore.
 *
 * Automatically sets the `uploadedAt` timestamp to the current time.
 * If the donation has no ID, generates a random one.
 *
 * @param {Partial<Donation> & { id?: string }} data - Donation data to save
 * @throws {Error} If the Firestore write fails
 */
export const saveDonationToCloud = async (data: Partial<Donation> & { id?: string }) => {
  try {
    const donationId = data.id || Math.random().toString(36);
    const donationRef = doc(db, COLLECTIONS.DONATIONS, donationId);
    await setDoc(donationRef, {
      ...data,
      uploadedAt: new Date(),
    });
  } catch (error) {
    console.error('Error adding document:', error);
    throw error;
  }
};
