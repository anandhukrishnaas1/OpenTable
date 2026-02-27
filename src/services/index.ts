/**
 * Service layer exports for OpenTable.
 * Centralizes all external service integrations.
 * @module services
 */

export { auth, db, analytics, signInWithGoogle, registerWithEmail, loginWithEmail, logout, saveDonationToCloud } from './firebase';
export { uploadToCloudinary } from './cloudinary';
export { analyzeFoodImage } from './geminiService';
