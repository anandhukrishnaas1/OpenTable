/**
 * Environment configuration and validation for OpenTable.
 * Ensures all required environment variables are present at startup.
 * @module config/env
 */

/** Shape of the application's environment variables */
interface EnvConfig {
    /** Firebase project API key */
    FIREBASE_API_KEY: string;
    /** OpenRouter API key for Gemini AI */
    OPENROUTER_API_KEY: string;
    /** Cloudinary cloud name for image uploads */
    CLOUDINARY_CLOUD_NAME: string;
    /** Cloudinary unsigned upload preset */
    CLOUDINARY_UPLOAD_PRESET: string;
}

/**
 * Validates that all required environment variables are defined.
 * Throws an error listing missing variables if any are absent.
 *
 * @returns {EnvConfig} Validated environment configuration
 * @throws {Error} If any required environment variable is missing
 */
function validateEnv(): EnvConfig {
    const required: Record<keyof EnvConfig, string | undefined> = {
        FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
        OPENROUTER_API_KEY: import.meta.env.VITE_OPENROUTER_API_KEY,
        CLOUDINARY_CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
        CLOUDINARY_UPLOAD_PRESET: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
    };

    const missing = Object.entries(required)
        .filter(([, value]) => !value)
        .map(([key]) => `VITE_${key}`);

    if (missing.length > 0 && import.meta.env.PROD) {
        console.error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    return {
        FIREBASE_API_KEY: required.FIREBASE_API_KEY ?? '',
        OPENROUTER_API_KEY: required.OPENROUTER_API_KEY ?? '',
        CLOUDINARY_CLOUD_NAME: required.CLOUDINARY_CLOUD_NAME ?? '',
        CLOUDINARY_UPLOAD_PRESET: required.CLOUDINARY_UPLOAD_PRESET ?? '',
    };
}

/** Validated application environment configuration */
export const env = validateEnv();
