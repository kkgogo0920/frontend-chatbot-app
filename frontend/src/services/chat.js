import axios from 'axios';
import { API_URL } from '../constants/config';

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to add the auth token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

class ChatService {
    async sendMessage(message) {
        try {
            const response = await axiosInstance.post('/chat/message', { message });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getHistory() {
        try {
            const response = await axiosInstance.get('/chat/history');
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default new ChatService(); 