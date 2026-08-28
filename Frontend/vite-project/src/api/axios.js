import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://via.placeholder.com/150';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  return `${API_BASE_URL}${imagePath}`;
};

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
});

api.interceptors.request.use((config) => {
    const adminUser = localStorage.getItem("adminUser");
    if (adminUser) {
        config.headers['X-Admin-Role'] = 'admin';
    }
    const userId = localStorage.getItem("userId");
    if (userId) {
        config.headers['X-User-Id'] = userId;
    }
    return config;
});

export default api;