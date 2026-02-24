import axios from 'axios';

// const API_URL = 'http://localhost:8000';
const API_URL = 'https://ai-csv-backend.onrender.com';

export const uploadCSV = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post(`${API_URL}/analyze`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error uploading CSV:", error);
        throw error;
    }
};
