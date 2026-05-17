import axios from 'axios';

const api = axios.create({
  baseURL: window.API_URL || '/api',
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const getBasename = () => {
  if (window.APP_URL) {
    try {
      const url = new URL(window.APP_URL);
      const pathname = url.pathname.replace(/\/$/, '');
      return pathname;
    } catch (e) {
      return '';
    }
  }
  return '';
};

api.interceptors.response.use(response => response, error => {
  if (error.response && error.response.status === 401) {
      const token = localStorage.getItem('auth_token');
      const basename = getBasename();
      const loginPath = `${basename}/login`;
      
      if (token && window.location.pathname !== loginPath) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          window.location.href = `${loginPath}?session_expired=1`;
      }
  }
  return Promise.reject(error);
});

export default api;
