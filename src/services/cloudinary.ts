const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const uploadToCloudinary = async (base64Image: string): Promise<string> => {
    if (!import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || !UPLOAD_PRESET) {
        throw new Error('Cloudinary environment variables missing');
    }

    try {
        const formData = new FormData();
        formData.append('file', base64Image);
        formData.append('upload_preset', UPLOAD_PRESET);

        const response = await fetch(CLOUDINARY_URL, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Failed to upload to Cloudinary');
        }

        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        throw error;
    }
};
