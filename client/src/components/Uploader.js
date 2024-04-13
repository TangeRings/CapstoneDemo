// Uploader.js
import axios from 'axios';

export const uploadFileToServer = async (file, studentId) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('studentId', studentId);

    // Specify the full URL path including protocol, hostname, and port
    const url = 'http://localhost:5000/upload';

    try {
        const response = await axios.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
};






