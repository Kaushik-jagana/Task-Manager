import axios from 'axios';

// Create an Axios instance with the base URL
const api = axios.create({
  baseURL: 'https://task-manager-3v8m.onrender.com',
});

// Intercept requests to add the Authorization header if the token is present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses and errors globally (optional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      // Handle unauthorized access globally, like redirecting to login
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
