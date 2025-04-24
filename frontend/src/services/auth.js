import axios from 'axios';
import { API_URL } from '../constants/config';

const AuthService = {
    login: async (username, password) => {
        try {
            const response = await axios.post(`${API_URL}/login`, {
                username,
                password
            });
            
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: '登录失败' };
        }
    },

    register: async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/register`, userData);
            
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: '注册失败' };
        }
    },

    logout: () => {
        localStorage.removeItem('token');
    },

    getCurrentUser: () => {
        const token = localStorage.getItem('token');
        return token ? { token } : null;
    },

    getToken() {
        return localStorage.getItem('token');
    },

    isAuthenticated() {
        return !!this.getToken();
    },

    refreshToken: async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_URL}/auth/refresh-token`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            
            return response.data;
        } catch (error) {
            AuthService.logout();
            throw error;
        }
    },

    getUserProfile: async () => {
        try {
            const response = await axios.get(`${API_URL}/auth/profile`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    setupInterceptors() {
        // Request interceptor - Add token to requests
        axios.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                config.withCredentials = true;
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor - Handle token refresh
        axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
                
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    try {
                        const { token } = await AuthService.refreshToken();
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return axios(originalRequest);
                    } catch (refreshError) {
                        AuthService.logout();
                        throw refreshError;
                    }
                }
                return Promise.reject(error);
            }
        );
    }
};

// 设置默认headers
axios.defaults.headers.common['Content-Type'] = 'application/json';

// 初始化拦截器
AuthService.setupInterceptors();

export default AuthService;