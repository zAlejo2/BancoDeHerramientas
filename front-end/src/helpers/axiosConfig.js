// axiosConfig.js
import axios from 'axios';

// Crear una instancia de axios
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // Asegúrate de tener esta variable de entorno configurada
});

// Interceptor para agregar el token a los headers
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        console.log('Token in interceptor:', token);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
