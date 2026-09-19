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
    const token = localStorage.getItem("authToken");
    if (token && token !== "undefined") {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Warm up the Vercel serverless backend on app load
// so the first real API call doesn't hit a cold start delay
if (typeof window !== "undefined") {
    api.get("/health").catch(() => {});
}

export default api;
