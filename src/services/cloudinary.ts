/**
 * Cloudinary image upload service for OpenTable.
 *
 * Handles uploading base64-encoded images to Cloudinary CDN
 * using unsigned upload presets for client-side uploads.
 *
 * @module services/cloudinary
 */

import { env } from '../config';

/** Cloudinary REST API upload endpoint */
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/upload`;

/**
 * Uploads a base64-encoded image to Cloudinary.
 *
 * Uses an unsigned upload preset so no server-side API secret is required.
 * Returns the secure HTTPS URL of the uploaded image.
 *
 * @param {string} base64Image - Base64-encoded image data URL
 * @returns {Promise<string>} The secure URL of the uploaded image
 * @throws {Error} If environment variables are missing or the upload fails
 *
 * @example
 * ```ts
 * const imageUrl = await uploadToCloudinary(base64DataUrl);
 * console.log(imageUrl); // "https://res.cloudinary.com/..."
 * ```
 */
export const uploadToCloudinary = async (base64Image: string): Promise<string> => {
    if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_UPLOAD_PRESET) {
        throw new Error('Cloudinary environment variables missing');
    }

    try {
        const formData = new FormData();
        formData.append('file', base64Image);
        formData.append('upload_preset', env.CLOUDINARY_UPLOAD_PRESET);

        const response = await fetch(CLOUDINARY_URL, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Failed to upload to Cloudinary');
        }

        const data = await response.json();
        return data.secure_url as string;
    } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        throw error;
    }
};
