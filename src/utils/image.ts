/**
 * Image processing utility functions.
 * @module utils/image
 */

/**
 * Converts a File object to a base64-encoded data URL string.
 *
 * @param {File} file - The image file to convert
 * @returns {Promise<string>} Base64-encoded data URL
 * @throws {Error} If the file cannot be read
 *
 * @example
 * ```ts
 * const base64 = await formatImageForUpload(fileInput.files[0]);
 * ```
 */
export function formatImageForUpload(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            } else {
                reject(new Error('Failed to read file as base64'));
            }
        };
        reader.onerror = () => reject(new Error('FileReader error'));
        reader.readAsDataURL(file);
    });
}

/**
 * Compresses an image file by resizing and reducing quality.
 * Uses canvas for client-side compression.
 *
 * @param {string} base64Image - Base64-encoded source image
 * @param {number} [maxWidth=1200] - Maximum output width in pixels
 * @param {number} [quality=0.8] - JPEG quality (0-1)
 * @returns {Promise<string>} Compressed base64-encoded data URL
 */
export function compressImage(
    base64Image: string,
    maxWidth = 1200,
    quality = 0.8
): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let { width, height } = img;

            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Could not get canvas context'));
                return;
            }

            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = () => reject(new Error('Failed to load image for compression'));
        img.src = base64Image;
    });
}
