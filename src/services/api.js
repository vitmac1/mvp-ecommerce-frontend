import axios from "axios";
const { VITE_API_URL } = import.meta.env;

const api = axios.create({
    baseURL: VITE_API_URL,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
