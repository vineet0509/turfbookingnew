import axios from 'axios';

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
  
  if (config.url) {
    let url = config.url;
    if (window.APP_URL && url.startsWith(window.APP_URL)) {
      url = url.substring(window.APP_URL.length);
    } else {
      try {
        const parsed = new URL(url);
        if (parsed.origin === window.location.origin) {
          const basename = getBasename();
          let pathname = parsed.pathname;
          if (basename && pathname.startsWith(basename)) {
            pathname = pathname.substring(basename.length);
          }
          url = pathname + parsed.search + parsed.hash;
        }
      } catch (e) {}
    }
    
    // If the URL already contains the /api prefix, strip it to prevent double-prefixing
    if (url.startsWith('/api')) {
      url = url.substring(4);
    }
    
    config.url = url;
  }
  
  return config;
});


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
