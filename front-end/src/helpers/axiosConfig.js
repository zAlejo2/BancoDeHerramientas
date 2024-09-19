// axiosConfig.js
import axios from 'axios';

// Crear una instancia de axios
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL, 
});

// Interceptor para agregar el token a los headers
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('authToken'); 
            window.location.href = '/login';
            return Promise.reject(error);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
