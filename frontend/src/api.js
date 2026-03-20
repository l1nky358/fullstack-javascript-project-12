import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('🚀 Request:', config.method.toUpperCase(), config.url);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Error:', error.response?.status, error.config?.url);
    return Promise.reject(error);
  }
);

export default api;
